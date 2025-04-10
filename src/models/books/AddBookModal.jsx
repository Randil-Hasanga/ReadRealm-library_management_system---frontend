import { useState, useEffect } from "react";
import AuthorService from "../../services/AuthorService";

const AddBookModal = ({ isOpen, onClose, onSubmit }) => {
    const [newBook, setNewBook] = useState({
        book_name: "",
        ISBN: "",
        author_id: 0,
        quantity: 0,
        available_qty: 0,
    });
    const [authors, setAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingAuthors, setLoadingAuthors] = useState(false);
    const [authorWarning, setAuthorWarning] = useState(""); // State for warning message

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

        if (name === 'author_id') {
            setSearchQuery(value);
            setAuthorWarning(""); // Clear warning when user types

            if (value === "") {
                setNewBook((prevState) => ({
                    ...prevState,
                    author_id: "",
                }));
            }
        } else if (name === 'quantity') {
            value = parseInt(value);
            setNewBook((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
        else {
            setNewBook((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    // Handle author selection from the datalist
    const handleAuthorSelection = (e) => {
        const selectedAuthor = authors.find(
            (author) => author.author_name === e.target.value
        );
        if (selectedAuthor) {
            setNewBook((prevState) => ({
                ...prevState,
                author_id: selectedAuthor.author_id,
            }));
            setSearchQuery(selectedAuthor.author_name);
            setAuthorWarning(""); // Clear warning if a valid author is selected
        } else {
            setAuthorWarning("Author not found. Please select a valid author."); // Set warning if author is not found
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Check if the author exists before submitting
        const selectedAuthor = authors.find(author => author.author_name === searchQuery);
        if (!selectedAuthor) {
            setAuthorWarning("Please select a valid author.");
            return; // Prevent submission if author is invalid
        }
        onSubmit({ ...newBook, available_qty: newBook.quantity });
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-xl w-full sm:w-96">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Book</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Book Name</label>
                            <input
                                type="text"
                                name="book_name"
                                value={newBook.book_name}
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
                                value={newBook.ISBN}
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
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300
                                focus:border-orange-300 transition-all"
                            />
                            <datalist id="author-list">
                                {filteredAuthors.map((author) => (
                                    <option key={author.author_id} value={author.author_name} />
                                ))}
                            </datalist>
                            {authorWarning && <p className="text-red-500 text-sm mt-1">{authorWarning}</p>} {/* Display warning message */}
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={newBook.quantity}
                                onChange={handleInputChange}
                                required
                                className="mt-2 w-full px-4 py-2 border border-gray-300
                                rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
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
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default AddBookModal;