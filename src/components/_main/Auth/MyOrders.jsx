import React, { useContext, useEffect, useState } from "react";
import DataTableComponent from "react-data-table-component";
const DataTable = DataTableComponent.default || DataTableComponent;
import { GlobalContext } from "../../../context/GlobalContext";
import { getOrderList } from "../../../services";
import ViewOrder from "./ViewOrder";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
// import DatePicker from "react-bootstrap-date-picker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MyOrders({ reset }) {
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState();
    const [viewOrder, setViewOrder] = useState(false);
    const [selectedCode, setSelectedCode] = useState();
    const [selectedDate, setSelectedDate] = useState(null);

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
                        onClick={(e) => {
                            setViewOrder(true);
                            setSelectedCode(row?.code);
                        }}
                    >
                        View
                    </button>
                    <button className="btn btn-sm cancelOrder d-none">Cancel</button>
                </div>
            ),
        },
    ];

    // Handle
    // Handle
    const fetchData = async (page, isClear = false, customPerPage = perPage) => {
        setLoading(true);
        const custCode = user?.data?.customerCode || user?.customerCode;

        let payload = {
            fromDate: isClear ? "" : (fromDate || ""),
            toDate: isClear ? "" : (toDate || ""),
            transactionId: isClear ? "" : transactionId,
            customerCode: custCode,
            page: page,
            perPage: customPerPage, // Many backends use perPage
            limit: customPerPage,   // Some backends use limit
            per_page: customPerPage, // Others use per_page
            pageSize: customPerPage,
            page_size: customPerPage,
            size: customPerPage
        };

        try {
            // Initial fetch to see what the backend honors
            let reqPayload = { ...payload };
            let firstResponse = await getOrderList(reqPayload);
            let totalCount = firstResponse.totalCount || 0;
            // Determine the true limit the backend gave us (e.g. 10)
            let actualBackendLimit = firstResponse.perPage || (firstResponse.data && firstResponse.data.length) || 10;
            if (actualBackendLimit === 0) actualBackendLimit = 10;

            // If backend already gave us enough, or there are no more records anyway, just return
            if (actualBackendLimit >= customPerPage || totalCount <= actualBackendLimit) {
                setData(firstResponse.data || []);
                setTotalRows(totalCount);
                setPerPage(customPerPage);
                setCurrentPage(page);
                setLoading(false);
                return;
            }

            // --- VIRTUAL PAGING ---
            // If user wants page=1 (size 15) and backend gives size 10:
            // We need items 0 to 14. Which means backend page 1 (items 0-9) and backend page 2 (items 10-19)
            const startIdx = (page - 1) * customPerPage;
            const endIdx = startIdx + customPerPage;

            const startBackendPage = Math.floor(startIdx / actualBackendLimit) + 1;
            const endBackendPage = Math.floor((endIdx - 1) / actualBackendLimit) + 1;

            let allAggregatedData = [];

            for (let p = startBackendPage; p <= endBackendPage; p++) {
                let currentRes;
                if (p === page) {
                    // We already fetched the UI 'page' which coincidentally might have been this backend page 
                    // (Note: works best if UI page == Backend page, but fetching it again if not matching is fine)
                    currentRes = firstResponse;
                } else {
                    let subsequentPayload = { ...payload, page: p };
                    currentRes = await getOrderList(subsequentPayload);
                }

                if (currentRes.data) {
                    allAggregatedData = allAggregatedData.concat(currentRes.data);
                }

                // Stop early if hit the end of available backend records
                if (!currentRes.data || currentRes.data.length < actualBackendLimit) {
                    break;
                }
            }

            // Slice out exactly the portion requested by the UI
            // calculate the starting index of the aggregated data array relative to the overall dataset
            const aggregatedStartIdx = (startBackendPage - 1) * actualBackendLimit;
            // relative offset to start taking items for the UI
            const localStart = startIdx - aggregatedStartIdx;
            
            const slicedData = allAggregatedData.slice(localStart, localStart + customPerPage);

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
        if (fromDate === "" && toDate === "") {
            fetchData(1, false, perPage);
        } else {
            if (fromDate <= toDate) {
                fetchData(1, false, perPage);
            } else {
                toast.error("From Date cannot be greater than To Date.");
            }
        }
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

    return (
        <>
            {viewOrder === false ? (
                <div className="container py-3">
                    <div className="row align-items-end">
                        <div className="col-lg-4 col-md-6 col-sm-12 my-1">
                            <label className="form-label searchLabel">From Date</label>
                            <input
                                className="form-control searchInput"
                                type="date"
                                value={fromDate}
                                onChange={(e) => {
                                    setFromDate(e.target.value);
                                }}
                            />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 my-1">
                            <label className="form-label searchLabel">To Date</label>
                            <input
                                className="form-control searchInput"
                                type="date"
                                value={toDate}
                                onChange={(e) => {
                                    setToDate(e.target.value);
                                }}
                            />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 my-1">
                            <label className="form-label searchLabel">
                                Transaction ID
                            </label>
                            <input
                                className="form-control searchInput"
                                type="text"
                                value={transactionId}
                                onChange={(e) => {
                                    setTransactionId(e.target.value);
                                }}
                            />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 my-1">
                            <div className="row gx-5 m-0 p-0">
                                <div className="col-lg-6 col-md-6 col-sm-6 py-2 px-1">
                                    <button
                                        type="button"
                                        className="w-100 btn btn-sm searchBtn"
                                        onClick={handleSearch}
                                    >
                                        Search
                                    </button>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 py-2 px-1">
                                    <button
                                        type="button"
                                        className="w-100 btn btn-sm clearBtn"
                                        onClick={handleClear}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-lg-2 col-md-6 col-sm-12 my-1"></div> */}
                        <div className="col-12 pt-4">
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
                </div>
            ) : (
                <div className="d-flex flex-column justify-content-center align-items-center py-4 px-2">
                    {/* Back Button */}
                    <div
                        className="w-100 container-fluid p-0 m-0 pt-2 pb-4 px-2 text-start"
                        onClick={() => {
                            setViewOrder(false);
                        }}
                    >
                        <IoArrowBackCircleOutline
                            style={{ width: "1.6rem", height: "1.6rem", cursor: "pointer" }}
                            className="text-secondary"
                        />
                    </div>
                    <ViewOrder selectedCode={selectedCode} />
                </div>
            )}
        </>
    );
}

export default MyOrders;
