import Table from "../components/Table";
import BorrowedBooksService from "../services/BorrowedBooksService";
import { useState, useEffect, useReducer } from "react";
import Icon from "../components/Icon";
import ReturnConfirmationDialog from "../components/ReturnConfirmationDialog";
import Pagination from "../components/Pagination";

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
    const [selectedBorrowedBook, setSelectedBorrowedBook] = useState(null);
    const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
    const [currentBorrowedBookPage, setCurrentBorrowedBookPage] = useState(1);
    const [currentOverdueBookPage, setCurrentOverdueBookPage] = useState(1);
    const [booksPerPage] = useState(10);

    // UseReducer hook for managing the switch between borrowed and overdue
    const [state, dispatch] = useReducer(switchReducer, {
        activeSection: "borrowed", // default section is borrowed
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

    const handleReturnBookClick = (book) => {
        setSelectedBorrowedBook(book);
        setIsReturnDialogOpen(true);
    };

    const handleCloseReturnDialog = () => {
        setIsReturnDialogOpen(false);
        setSelectedBorrowedBook(null);
    };

    const handleReturnConfirmation = async () => {
        if (!selectedBorrowedBook) {
            return;
        }

        try {
            const bb_id = selectedBorrowedBook.BorrowedBookID;
            const response = await BorrowedBooksService.returnBorrowedBook(bb_id);
            console.log("Book Returned:", response);

            if (typeof response === 'string') {
                alert(response);
                return;
            }

            const updatedList = await BorrowedBooksService.getBorrowedBooks(true);
            setBorrowedBooks(updatedList);
            setIsReturnDialogOpen(false);
            setSelectedBorrowedBook(null);
        } catch (error) {
            console.error("Error returning book:", error);
            alert('Cannot mark book as returned. Outstanding fines must be paid first.');
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

            <ReturnConfirmationDialog
                isOpen={isReturnDialogOpen}
                onClose={handleCloseReturnDialog}
                onConfirm={handleReturnConfirmation}
                type="book"
                bookName={selectedBorrowedBook ? selectedBorrowedBook.BookName : ''}
                borrowerName={selectedBorrowedBook ? selectedBorrowedBook.BorrowerFullName : ''}
            />
        </div>
    );
};

export default BorrowedBooks;
