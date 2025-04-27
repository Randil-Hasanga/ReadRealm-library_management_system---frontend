import Table from "../components/Table";
import BorrowedBooksService from "../services/BorrowedBooksService";
import { useState, useEffect, useReducer } from "react";
import Icon from "../components/Icon";
import ReturnConfirmationDialog from "../components/ReturnConfirmationDialog";
import Pagination from "../components/Pagination";
import LendBookModal from "../models/borrowedBooks/LendBookModal"; // Import the LendBookModal

// Reducer for switching between borrowed books and overdue books
const switchReducer = (state, action) => {
    switch (action.type) {
        case "SET_BORROWED_BOOKS":
            return { ...state, activeSection: "borrowed" };
        case "SET_OVERDUE_BOOKS":
            return { ...state, activeSection: "overdue" };
        default:
            return state;
    }
};

const BorrowedBooks = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [overdueBooks, setOverdueBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLendBookModalOpen, setIsLendBookModalOpen] = useState(false); // State for Lend Book Modal
    const [currentBorrowedBookPage, setCurrentBorrowedBookPage] = useState(1);
    const [currentOverdueBookPage, setCurrentOverdueBookPage] = useState(1);
    const [booksPerPage] = useState(10);

    const [state, dispatch] = useReducer(switchReducer, {
        activeSection: "borrowed",
    });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const borrowed = await BorrowedBooksService.getBorrowedBooks();
                const overDue = await BorrowedBooksService.getOverdueBooks();
                setBorrowedBooks(borrowed);
                setOverdueBooks(overDue);
            } catch (error) {
                console.error(`Error fetching books: ${error}`);
                setErrorMessage('Failed to fetch books.');
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleLendBookClick = () => {
        setIsLendBookModalOpen(true); // Open the Lend Book Modal
    };

    const handleCloseLendBookModal = () => {
        setIsLendBookModalOpen(false); // Close the Lend Book Modal
    };

    const handleLendBookSubmit = async (lendData) => {
        try {
            await BorrowedBooksService.lendBook(lendData); // Call the service to lend the book
            const updatedList = await BorrowedBooksService.getBorrowedBooks(true); // Refresh the borrowed books list
            setBorrowedBooks(updatedList);
            setIsLendBookModalOpen(false); // Close the modal
        } catch (error) {
            console.error("Error lending book:", error);
            setErrorMessage("Failed to lend book.");
        }
    };

    const columns = [
        { label: "Book Name", field: "BookName" },
        { label: "Borrower", field: "BorrowerFullName" },
        { label: "Email", field: "email" },
        { label: "Contact No", field: "contact_no" },
        { label: "Borrowed Date", field: "borrowed_date" },
        { label: "Due Date", field: "return_date" }
    ];

    const renderActions = (book) => (
        <button
            className="text-gray-500 hover:text-gray-900"
            onClick={() => handleReturnBookClick(book)}
        >
            <Icon name="CornerUpLeft" color="green" />
        </button>
    );

    const indexOfLastBorrowedBook = currentBorrowedBookPage * booksPerPage;
    const indexOfLastOverdueBook = currentOverdueBookPage * booksPerPage;

    const indexOfFirstBorrowedBook = indexOfLastBorrowedBook - booksPerPage;
    const indexOfFirstOverdueBook = indexOfLastOverdueBook - booksPerPage;

    const currentBorrowedBooks = borrowedBooks.slice(indexOfFirstBorrowedBook, indexOfLastBorrowedBook);
    const currentOverdueBooks = overdueBooks.slice(indexOfFirstOverdueBook, indexOfLastOverdueBook);

    const totalBorrowedBookPages = Math.ceil(borrowedBooks.length / booksPerPage);
    const totalOverdueBookPages = Math.ceil(overdueBooks.length / booksPerPage);

    return (
        <div className="p-8 bg-gray-200 min-h-screen">
            <header className="flex justify-between items-center mb-6 mt-11">
                <div className="flex rounded-2xl shadow-sm">
                    <button
                        className={`text-2xl font-bold p-2.5 rounded-l-2xl  ${state.activeSection === "borrowed" ? "text-gray-700 bg-orange-300" : "text-slate-500  bg-gray-300"}`}
                        onClick={() => dispatch({ type: "SET_BORROWED_BOOKS" })}
                    >
                        Borrowed Books
                    </button>
                    <button
                        className={`text-2xl font-bold p-2.5 rounded-r-2xl ${state.activeSection === "overdue" ? "text-gray-700 bg-red-300" : "text-slate-500 bg-gray-300"}`}
                        onClick={() => dispatch({ type: "SET_OVERDUE_BOOKS" })}
                    >
                        Overdue Books
                    </button>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={handleLendBookClick}
                        className="bg-orange-300 shadow-md text-slate-600 px-4 py-2 rounded-md font-bold mr-4"
                    >
                        Lend Book
                    </button>
                    <input
                        type="text"
                        placeholder="Search by ID or Type"
                        className="border rounded-md p-2 w-64"
                    />
                </div>
            </header>

            {/* Display content based on the active section */}
            {state.activeSection === "borrowed" ? (
                <>
                    <Table columns={columns} data={currentBorrowedBooks} renderActions={renderActions} />
                    <Pagination
                        currentPage={currentBorrowedBookPage}
                        totalPages={totalBorrowedBookPages}
                        onPageChange={setCurrentBorrowedBookPage}
                    />
                </>
            ) : (
                <>
                    <Table columns={columns} data={currentOverdueBooks} renderActions={renderActions} isImportant={true} />
                    <Pagination
                        currentPage={currentOverdueBookPage}
                        totalPages={totalOverdueBookPages}
                        onPageChange={setCurrentOverdueBookPage}
                        isImportant={true}
                    />
                </>
            )}

            <LendBookModal
                isOpen={isLendBookModalOpen}
                onClose={handleCloseLendBookModal}
                onSubmit={handleLendBookSubmit}
            />
        </div>
    );
};

export default BorrowedBooks;
