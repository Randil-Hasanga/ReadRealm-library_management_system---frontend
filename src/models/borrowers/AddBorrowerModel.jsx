import { useState, useEffect } from "react";
import BorrowerService from "../../services/BorrowerService"; // Adjust to your actual service for Borrower

const AddBorrowerModal = ({ isOpen, onClose, onSubmit }) => {
    const [newBorrower, setNewBorrower] = useState({
        borrower_name: "",
        email: "",
        phone_number: "",
        address: "",
    });
    const [borrowers, setBorrowers] = useState([]);
    const [filteredBorrowers, setFilteredBorrowers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingBorrowers, setLoadingBorrowers] = useState(false);
    const [borrowerWarning, setBorrowerWarning] = useState(""); // State for warning message

    // Fetch all borrowers when the modal opens
    useEffect(() => {
        const fetchBorrowers = async () => {
            setLoadingBorrowers(true);
            try {
                const borrowersData = await BorrowerService.getBorrowers();
                setBorrowers(borrowersData);
                setFilteredBorrowers(borrowersData);
            } catch (error) {
                console.error("Error fetching borrowers:", error);
            } finally {
                setLoadingBorrowers(false);
            }
        };

        if (isOpen) {
            fetchBorrowers();
        }
    }, [isOpen]);

    // Filter borrowers based on search query
    useEffect(() => {
        if (searchQuery) {
            const filtered = borrowers.filter((borrower) =>
                borrower.borrower_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredBorrowers(filtered);
        } else {
            setFilteredBorrowers(borrowers);
        }
    }, [searchQuery, borrowers]);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "borrower_name") {
            setSearchQuery(value);
            setBorrowerWarning(""); // Clear warning when user types
        }

        setNewBorrower((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle borrower selection from the datalist
    const handleBorrowerSelection = (e) => {
        const selectedBorrower = borrowers.find(
            (borrower) => borrower.borrower_name === e.target.value
        );
        if (selectedBorrower) {
            setNewBorrower((prevState) => ({
                ...prevState,
                borrower_id: selectedBorrower.borrower_id,
            }));
            setSearchQuery(selectedBorrower.borrower_name);
            setBorrowerWarning(""); // Clear warning if a valid borrower is selected
        } else {
            setBorrowerWarning("Borrower not found. Please select a valid borrower.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check if the borrower exists before submitting
        const selectedBorrower = borrowers.find(
            (borrower) => borrower.borrower_name === searchQuery
        );
        if (!selectedBorrower) {
            setBorrowerWarning("Please select a valid borrower.");
            return; // Prevent submission if borrower is invalid
        }
        onSubmit({ ...newBorrower });
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-xl w-full sm:w-96">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Borrower</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Borrower Name</label>
                            <input
                                type="text"
                                name="borrower_name"
                                value={newBorrower.borrower_name}
                                onChange={handleInputChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={newBorrower.email}
                                onChange={handleInputChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={newBorrower.phone_number}
                                onChange={handleInputChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={newBorrower.address}
                                onChange={handleInputChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                            />
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-orange-600 text-white px-6 py-2 rounded-md"
                            >
                                Add Borrower
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default AddBorrowerModal;
