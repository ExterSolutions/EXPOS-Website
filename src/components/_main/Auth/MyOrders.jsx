import React, { useContext, useEffect, useState } from "react";
import DataTableComponent from "react-data-table-component";
const DataTable = DataTableComponent.default || DataTableComponent;
import { GlobalContext } from "../../../context/GlobalContext";
import { getOrderList } from "../../../services";
import ViewOrder from "./ViewOrder";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";

function MyOrders({ reset }) {
    const globalCtx = useContext(GlobalContext);
    const [user] = globalCtx.user;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewOrder, setViewOrder] = useState(false);
    const [selectedCode, setSelectedCode] = useState();
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);

    const getStatusBadgeStyle = (status = "") => {
        const s = String(status).toLowerCase();
        if (s.includes("deliver") || s.includes("complete") || s.includes("ready") || s.includes("place")) {
            return { background: "#e8f5e9", color: "#2e7d32" };
        }
        if (s.includes("cancel") || s.includes("reject") || s.includes("fail")) {
            return { background: "#ffebee", color: "#c62828" };
        }
        return { background: "#fff8e1", color: "#f57f17" };
    };

    const columns = [
        {
            name: "Order Code",
            selector: (row) => row?.orderCode,
            sortable: true,
        },
        {
            name: "Order Date",
            selector: (row) => row?.created_at,
            sortable: true,
        },
        {
            name: "Order Status",
            selector: (row) => row?.orderStatus,
            sortable: true,
        },
        {
            name: "GrandTotal",
            selector: (row) => row?.grandTotal,
            sortable: true,
            cell: (row) => <span>$ {row?.grandTotal}</span>,
        },
        {
            name: "Transaction Id",
            selector: (row) => row?.txnId,
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="action-dropdown">
                    <button
                        className="btn btn-sm viewOrder"
                        onClick={() => {
                            setViewOrder(true);
                            setSelectedCode(row?.code);
                        }}
                    >
                        View
                    </button>
                </div>
            ),
        },
    ];

    const fetchData = async (page, isClear = false, customPerPage = perPage) => {
        setLoading(true);
        const custCode = user?.data?.customerCode || user?.customerCode || user?.code;

        const payload = {
            fromDate: isClear ? "" : fromDate || "",
            toDate: isClear ? "" : toDate || "",
            transactionId: isClear ? "" : transactionId,
            customerCode: custCode,
            page: page,
            perPage: customPerPage,
            limit: customPerPage,
            per_page: customPerPage,
            pageSize: customPerPage,
            page_size: customPerPage,
            size: customPerPage,
        };

        try {
            const firstResponse = await getOrderList({ ...payload });
            const totalCount = firstResponse.totalCount || 0;
            let actualBackendLimit =
                firstResponse.perPage ||
                (firstResponse.data && firstResponse.data.length) ||
                10;
            if (actualBackendLimit === 0) actualBackendLimit = 10;

            if (actualBackendLimit >= customPerPage || totalCount <= actualBackendLimit) {
                setData(firstResponse.data || []);
                setTotalRows(totalCount);
                setPerPage(customPerPage);
                setCurrentPage(page);
                setLoading(false);
                return;
            }

            const startIdx = (page - 1) * customPerPage;
            const endIdx = startIdx + customPerPage;
            const startBackendPage = Math.floor(startIdx / actualBackendLimit) + 1;
            const endBackendPage = Math.floor((endIdx - 1) / actualBackendLimit) + 1;

            let allAggregatedData = [];

            for (let p = startBackendPage; p <= endBackendPage; p++) {
                const currentRes =
                    p === page
                        ? firstResponse
                        : await getOrderList({ ...payload, page: p });

                if (currentRes.data) {
                    allAggregatedData = allAggregatedData.concat(currentRes.data);
                }
                if (!currentRes.data || currentRes.data.length < actualBackendLimit) {
                    break;
                }
            }

            const aggregatedStartIdx = (startBackendPage - 1) * actualBackendLimit;
            const localStart = startIdx - aggregatedStartIdx;
            const slicedData = allAggregatedData.slice(
                localStart,
                localStart + customPerPage
            );

            setData(slicedData);
            setTotalRows(totalCount);
            setPerPage(customPerPage);
            setCurrentPage(page);
        } catch (err) {
            console.error("No Data Found", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        fetchData(page, false, perPage);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        fetchData(page, false, newPerPage);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (fromDate && toDate && fromDate > toDate) {
            toast.error("From Date cannot be greater than To Date.");
            return;
        }
        fetchData(1, false, perPage);
    };

    const handleClear = async () => {
        setFromDate("");
        setToDate("");
        setTransactionId("");
        fetchData(1, true, perPage);
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    useEffect(() => {
        if (reset === true) {
            setFromDate("");
            setToDate("");
            setTransactionId("");
            fetchData(1, true);
            setViewOrder(false);
        }
    }, [reset]);

    const totalPages = Math.max(1, Math.ceil((totalRows || data.length || 1) / perPage));

    return (
        <>
            {viewOrder === false ? (
                <div className="container-fluid px-1 px-md-2 py-2">
                    {/* Mobile Filter Toggle */}
                    <div className="d-flex d-md-none justify-content-between align-items-center mb-2">
                        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#222" }}>
                            Recent Orders {totalRows ? `(${totalRows})` : ""}
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowFiltersMobile((v) => !v)}
                            style={{
                                background: "#f3f4f6",
                                border: "1px solid #e5e7eb",
                                borderRadius: 8,
                                padding: "6px 12px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: "#333",
                            }}
                        >
                            {showFiltersMobile ? "Hide Filters ▲" : "Filter Orders ▼"}
                        </button>
                    </div>

                    {/* Filter Bar (always visible on md+, collapsible on mobile) */}
                    <div className={`${showFiltersMobile ? "d-block" : "d-none"} d-md-block mb-3`}>
                        <div className="row g-2 align-items-end">
                            <div className="col-lg-3 col-md-4 col-6">
                                <label className="form-label searchLabel mb-1" style={{ fontSize: "0.8rem" }}>
                                    From Date
                                </label>
                                <input
                                    className="form-control searchInput"
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-3 col-md-4 col-6">
                                <label className="form-label searchLabel mb-1" style={{ fontSize: "0.8rem" }}>
                                    To Date
                                </label>
                                <input
                                    className="form-control searchInput"
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-3 col-md-4 col-12">
                                <label className="form-label searchLabel mb-1" style={{ fontSize: "0.8rem" }}>
                                    Transaction ID
                                </label>
                                <input
                                    className="form-control searchInput"
                                    type="text"
                                    placeholder="Search txn ID"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-3 col-md-12 col-12 d-flex gap-2">
                                <button
                                    type="button"
                                    className="w-100 btn btn-sm searchBtn"
                                    style={{ minHeight: 38 }}
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    className="w-100 btn btn-sm clearBtn"
                                    style={{ minHeight: 38 }}
                                    onClick={handleClear}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card List (< 768px) */}
                    <div className="d-md-none">
                        {loading ? (
                            <div className="text-center py-4 text-muted">Loading your orders...</div>
                        ) : data.length === 0 ? (
                            <div className="text-center py-4 text-muted">No orders found.</div>
                        ) : (
                            <div className="d-flex flex-column gap-2">
                                {data.map((row) => {
                                    const badge = getStatusBadgeStyle(row?.orderStatus);
                                    return (
                                        <div
                                            key={row?.code || row?.orderCode}
                                            style={{
                                                border: "1px solid #ececec",
                                                borderRadius: 12,
                                                padding: "12px 14px",
                                                background: "#fafafa",
                                            }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a1a" }}>
                                                    #{row?.orderCode}
                                                </span>
                                                <span
                                                    style={{
                                                        ...badge,
                                                        padding: "3px 10px",
                                                        borderRadius: 20,
                                                        fontSize: "0.74rem",
                                                        fontWeight: 700,
                                                        textTransform: "capitalize",
                                                    }}
                                                >
                                                    {row?.orderStatus || "Placed"}
                                                </span>
                                            </div>
                                            <div
                                                className="d-flex justify-content-between align-items-center text-muted mb-2"
                                                style={{ fontSize: "0.8rem" }}
                                            >
                                                <span>{row?.created_at}</span>
                                                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a1a" }}>
                                                    ${row?.grandTotal}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="w-100 btn btn-sm viewOrder"
                                                style={{
                                                    minHeight: 40,
                                                    borderRadius: 10,
                                                    fontWeight: 600,
                                                }}
                                                onClick={() => {
                                                    setViewOrder(true);
                                                    setSelectedCode(row?.code);
                                                }}
                                            >
                                                View Order Details
                                            </button>
                                        </div>
                                    );
                                })}

                                {/* Mobile Pagination */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center pt-2">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            disabled={currentPage <= 1 || loading}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            ← Prev
                                        </button>
                                        <span style={{ fontSize: "0.82rem", color: "#666", fontWeight: 600 }}>
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            disabled={currentPage >= totalPages || loading}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Desktop DataTable (>= 768px) */}
                    <div className="d-none d-md-block pt-2">
                        <DataTable
                            columns={columns}
                            data={data}
                            progressPending={loading}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            paginationPerPage={perPage}
                            onChangeRowsPerPage={handlePerRowsChange}
                            onChangePage={handlePageChange}
                        />
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column justify-content-center align-items-center py-2 px-1">
                    <div
                        className="w-100 d-flex align-items-center gap-2 py-2 px-1 text-start"
                        style={{ cursor: "pointer" }}
                        onClick={() => setViewOrder(false)}
                    >
                        <IoArrowBackCircleOutline
                            style={{ width: "1.6rem", height: "1.6rem" }}
                            className="text-secondary"
                        />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#555" }}>
                            Back to Orders
                        </span>
                    </div>
                    <ViewOrder selectedCode={selectedCode} />
                </div>
            )}
        </>
    );
}

export default MyOrders;
