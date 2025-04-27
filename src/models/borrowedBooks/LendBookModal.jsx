import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BookService from "../../services/BookService";
import BorrowerService from "../../services/BorrowerService";

const LendBookModal = ({ isOpen, onClose, onSubmit }) => {
    const [books, setBooks] = useState([]);
    const [borrowers, setBorrowers] = useState([]);
    const [lendData, setLendData] = useState({
        book_id: "",
        borrower_id: "",
        isReturned: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const booksData = await BookService.getBooks();
                const borrowersData = await BorrowerService.getBorrowers();
                setBooks(booksData);
                setBorrowers(borrowersData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLendData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(lendData);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-xl w-full sm:w-96">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Lend Book</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Book</label>
                            <select
                                name="book_id"
                                value={lendData.book_id}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select a book</option>
                                {books.map((book) => (
                                    <option key={book.book_id} value={book.book_id}>
                                        {book.book_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Borrower</label>
                            <select
                                name="borrower_id"
                                value={lendData.borrower_id}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select a borrower</option>
                                {borrowers.map((borrower) => (
                                    <option key={borrower.borrower_id} value={borrower.borrower_id}>
                                        {borrower.BorrowerFullName}
                                    </option>
                                ))}
                            </select>
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
                                Lend
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

LendBookModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default LendBookModal;