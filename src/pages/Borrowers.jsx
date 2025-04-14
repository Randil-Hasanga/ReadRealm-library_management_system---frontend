import { useEffect, useState } from "react";
import Table from "../components/Table";
import Loader from "../components/Loader";
import Icon from "../components/Icon";
import BorrowerService from "../services/BorrowerService";
import AddBorrowerModal from "../models/borrowers/AddBorrowerModel";
import UpdateBorrowerModal from "../models/borrowers/UpdateBorrowerModel";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import Pagination from "../components/Pagination";

const Borrowers = () => {
    const [borrowers, setBorrowers] = useState([]); // Ensure it's always an array
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedBorrower, setSelectedBorrower] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        const fetchBorrowers = async () => {
            try {
                const response = await BorrowerService.getBorrowers();
                setBorrowers(response || []); // Ensure data is always an array
            } catch (error) {
                console.error("Error fetching borrowers:", error);
                setErrorMessage("Failed to fetch borrowers.");
            } finally {
                setLoading(false);
            }
        };
        fetchBorrowers();
    }, []);

    const handleAddClick = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleUpdateClick = (borrower) => {
        setSelectedBorrower(borrower);
        setIsUpdateModalOpen(true);
    };
    const handleCloseUpdateModal = () => {
        setSelectedBorrower(null);
        setIsUpdateModalOpen(false);
    };

    const handleDeleteClick = (borrower) => {
        setSelectedBorrower(borrower);
        setIsDeleteDialogOpen(true);
    };
    const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);

    const handleAddSubmit = async (newBorrower) => {
        try {
            await BorrowerService.addBorrower(newBorrower);
            const updatedList = await BorrowerService.getBorrowers(true); // force refresh
            setBorrowers(updatedList);

            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Add Error:", error);
            setErrorMessage("Failed to add borrower.");
        }
    };

    const handleUpdateBorrowerSubmit = async (updatedBorrower) => {
        try {
            const borrowerId = selectedBorrower.borrower_id;
            const result = await BorrowerService.updateBorrower(borrowerId, updatedBorrower);
            console.log("Updated Borrower:", result);

            setBorrowers((prevBorrowers) =>
                prevBorrowers.map((borrower) =>
                    borrower.borrower_id === borrowerId
                        ? { ...borrower, ...updatedBorrower, BorrowerFullName: `${updatedBorrower.fname} ${updatedBorrower.lname}` }
                        : borrower
                )
            );



            setIsUpdateModalOpen(false);
            setSelectedBorrower(null);
        } catch (error) {
            console.error("Error updating borrower:", error);
            setErrorMessage('Failed to update borrower.');
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            const id = selectedBorrower.borrower_id;
            const response = await BorrowerService.deleteBorrower(id);
            if (typeof (response.effectedRows) == 'string') {
                alert('Borrower has unpaid fines')
            } else {
                const updatedList = await BorrowerService.getBorrowers(true); // force refresh
                setBorrowers(updatedList);

            }

            setIsDeleteDialogOpen(false);
            setSelectedBorrower(null);
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Make sure borrowers is an array before calling .slice
    const currentItems = Array.isArray(borrowers) ? borrowers.slice(indexOfFirstItem, indexOfLastItem) : [];

    const totalPages = Math.ceil(borrowers.length / itemsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    const columns = [
        { label: "ID", field: "borrower_id" },
        { label: "Borrower Name", field: "BorrowerFullName" },
        { label: "NIC", field: "NIC" },
        { label: "Email", field: "email" },
        { label: "Phone", field: "contact_no" },
        { label: "Address", field: "address" },
    ];

    const renderActions = (borrower) => (
        <>
            <button onClick={() => handleUpdateClick(borrower)} className="text-gray-500 hover:text-gray-900">
                <Icon name="RefreshCw" />
            </button>
            <button onClick={() => handleDeleteClick(borrower)} className="text-red-500 hover:text-red-700 ml-2">
                <Icon name="Trash2" />
            </button>
        </>
    );

    return (
        <div className="p-8 bg-gray-200 min-h-screen">
            {loading && <Loader />}
            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

            <header className="flex justify-between items-center mb-6 mt-11">
                <h1 className="text-3xl font-bold text-orange-600">Borrower Management</h1>
                <button
                    onClick={handleAddClick}
                    className="bg-orange-300 shadow-md text-slate-600 px-4 py-2 rounded-md font-bold"
                >
                    Add Borrower
                </button>
            </header>

            <Table columns={columns} data={currentItems} renderActions={renderActions} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

            <AddBorrowerModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSubmit={handleAddSubmit}
            />
            {selectedBorrower && (
                <UpdateBorrowerModal
                    isOpen={isUpdateModalOpen}
                    onClose={handleCloseUpdateModal}
                    onSubmit={handleUpdateBorrowerSubmit}
                    borrower={selectedBorrower}
                />
            )}
            {selectedBorrower && (
                <DeleteConfirmationDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                    onConfirm={handleDeleteSubmit}
                    type="borrower"
                    name={`${selectedBorrower.BorrowerFullName}`}
                />
            )}
        </div>
    );
};

export default Borrowers;
