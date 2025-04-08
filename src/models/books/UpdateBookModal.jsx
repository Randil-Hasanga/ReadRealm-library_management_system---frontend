import { useState, useEffect } from "react";
import AuthorService from "../../services/AuthorService";
import PropTypes from "prop-types";  // Import PropTypes

const UpdateBookModal = ({ isOpen, onClose, onSubmit, book }) => {
    const [updatedBook, setUpdatedBook] = useState({
        book_name: "",
        ISBN: "",
        author_id: "",
        quantity: "",
        available_qty: "",
    });
    const [authors, setAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingAuthors, setLoadingAuthors] = useState(false);
    const [error, setError] = useState("");

    // Fetch all authors when the modal opens
    useEffect(() => {
        const fetchAuthors = async () => {
            setLoadingAuthors(true);
            try {
                const authorsData = await AuthorService.getAuthors();
                setAuthors(authorsData);
                setFilteredAuthors(authorsData);
            } catch (error) {
                console.error("Error fetching authors:", error);
            } finally {
                setLoadingAuthors(false);
            }
        };

        if (isOpen) {
            fetchAuthors();
        }
    }, [isOpen]);

    // Update the form with book details when the modal opens
    useEffect(() => {
        if (book && isOpen) {
            setUpdatedBook({
                book_name: book.book_name,
                ISBN: book.ISBN,
                author_id: book.author_id,
                quantity: book.quantity,
                available_qty: book.available_qty,
            });

            const author = authors.find((author) => author.author_id === book.author_id);
            setSearchQuery(author ? author.author_name : "");
        }
    }, [isOpen, book, authors]);

    // Filter authors based on search query
    useEffect(() => {
        if (searchQuery) {
            const filtered = authors.filter((author) =>
                author.author_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredAuthors(filtered);
        } else {
            setFilteredAuthors(authors);
        }
    }, [searchQuery, authors]);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "author_id") {
            setSearchQuery(value);
        } else {
            setUpdatedBook((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }

        // Reset the error when user starts typing again
        if (name === "quantity") {
            setError("");
        }
    };

    // Handle author selection from the datalist
    const handleAuthorSelection = (e) => {
        const selectedAuthor = authors.find(
            (author) => author.author_name === e.target.value
        );
        if (selectedAuthor) {
            setUpdatedBook((prevState) => ({
                ...prevState,
                author_id: selectedAuthor.author_id,
            }));
            setSearchQuery(selectedAuthor.author_name);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Calculate the difference in quantity
        const quantityDifference = updatedBook.quantity - book.quantity;

        // Check if the new available quantity will go below 0
        const newAvailableQty = book.available_qty + quantityDifference;
        if (newAvailableQty < 0) {
            setError("Some books are already borrowed");
            return;
        }

        // Update the book object with the new available_qty
        const updatedBookWithNewAvailableQty = {
            ...updatedBook,
            available_qty: newAvailableQty,
        };

        // Submit the updated book with the new available quantity
        onSubmit(updatedBookWithNewAvailableQty);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-xl w-full sm:w-96">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Book</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Book Name</label>
                            <input
                                type="text"
                                name="book_name"
                                value={updatedBook.book_name}
                                onChange={handleInputChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">ISBN</label>
                            <input
                                type="text"
                                name="ISBN"
                                value={updatedBook.ISBN}
                                onChange={handleInputChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Author</label>
                            <input
                                type="text"
                                name="author_id"
                                value={searchQuery}
                                onChange={handleInputChange}
                                list="author-list"
                                onBlur={handleAuthorSelection}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                            />
                            <datalist id="author-list">
                                {filteredAuthors.map((author) => (
                                    <option key={author.author_id} value={author.author_name} />
                                ))}
                            </datalist>
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={updatedBook.quantity}
                                onChange={handleInputChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                            />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
                                Update Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

// Add PropTypes validation
UpdateBookModal.propTypes = {
    isOpen: PropTypes.bool.isRequired, 
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    book: PropTypes.shape({
        book_name: PropTypes.string.isRequired,
        ISBN: PropTypes.string.isRequired,
        author_id: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        available_qty: PropTypes.number.isRequired,
    }).isRequired,
};

export default UpdateBookModal;
