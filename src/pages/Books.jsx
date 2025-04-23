import { useEffect, useState } from "react";
import BookService from "../services/BookService";
import Table from "../components/Table";
import Loader from "../components/Loader";
import Icon from "../components/Icon";
import AddBookModal from "../models/books/AddBookModal";
import UpdateBookModal from "../models/books/UpdateBookModal";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import ReturnConfirmationDialog from "../components/ReturnConfirmationDialog";
import Pagination from "../components/Pagination";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isUpdateBookModalOpen, setIsUpdateBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch books from the API on initial load
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await BookService.getBooks();
        setBooks(data);
      } catch (error) {
        console.error(`Error fetching books: ${error}`);
        setErrorMessage('Failed to fetch books.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Handle opening the modal for adding a new book
  const handleAddBookClick = () => {
    setIsAddBookModalOpen(true);
  };

  // Handle closing the Add Book Modal
  const handleCloseAddBookModal = () => {
    setIsAddBookModalOpen(false);
  };

  // Handle opening the Update Book Modal
  const handleUpdateBookClick = (book) => {
    setSelectedBook(book);
    setIsUpdateBookModalOpen(true);
  };

  // Handle closing the Update Book Modal
  const handleCloseUpdateBookModal = () => {
    setIsUpdateBookModalOpen(false);
    setSelectedBook(null);
  };

  const handleDeleteBookClick = (book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  }

  const handleCloseDeleteConfirmation = () => {
    setIsDeleteDialogOpen(false);
  }

  const handleAddBookSubmit = async (newBook) => {
    try {
      const addedBook = await BookService.addBook(newBook);
      console.log("Added Book:", addedBook);
      const updatedList = await BookService.getBooks(true);
      setBooks(updatedList);
      setIsAddBookModalOpen(false);
    } catch (error) {
      console.error("Error adding book:", error);
      setErrorMessage('Failed to add book.');
    }
  };

  // method to handle update book
  const handleUpdateBookSubmit = async (updatedBook) => {
    try {
      const bookId = selectedBook.book_id;
      const result = await BookService.updateBook(bookId, updatedBook);
      console.log("Updated Book:", result);

      const updatedList = await BookService.getBooks(true);
      setBooks(updatedList);
      setIsUpdateBookModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
      setErrorMessage('Failed to update book.');
    }
  };

  const handleDeleteBookSubmit = async () => {
    if (!selectedBook) return;

    setIsDeleting(true);
    setErrorMessage('');
    try {
      const bookId = selectedBook.book_id;
      const response = await BookService.deleteBook(bookId);

      console.log("Book Deleted:", response);

      if (typeof (response) == 'string') {
        //show a popup message window to say someone still borrowed the book
        alert(response);
        return;
      }

      const updatedList = await BookService.getBooks(true);
      setBooks(updatedList);

      setIsDeleteDialogOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Table columns for books
  const columns = [
    { label: "Book Name", field: "book_name" },
    { label: "Author", field: "author_name" },
    { label: "ISBN", field: "ISBN" },
    { label: "QTY", field: "quantity" },
    { label: "Available QTY", field: "available_qty" },
  ];

  const renderActions = (book) => (
    <>
      <button
        className="text-gray-500 hover:text-gray-900"
        onClick={() => handleUpdateBookClick(book)}
      >
        <Icon name="RefreshCw" />
      </button>
      <button
        className="text-gray-500 hover:text-gray-900"
        onClick={() => handleDeleteBookClick(book)}
      >
        <Icon name="Trash2" color="red" />
      </button>
    </>
  );

  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      {loading && <Loader />}

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <header className="flex justify-between items-center mb-6 mt-11">
        <h1 className="text-3xl font-bold text-orange-600">Book Management</h1>
        <div className="flex items-center">
          <button
            className="bg-orange-300 shadow-md text-slate-600 px-4 py-2 rounded-md mr-4 font-bold"
            onClick={handleAddBookClick}
          >
            Add Book
          </button>
          <input
            type="text"
            placeholder="Search by ID or Type"
            className="border rounded-md p-2 w-64"
          />
        </div>
      </header>

      <Table columns={columns} data={currentBooks} renderActions={renderActions} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={handleCloseAddBookModal}
        onSubmit={handleAddBookSubmit}
      />
      {selectedBook && (<UpdateBookModal
        isOpen={isUpdateBookModalOpen}
        onClose={handleCloseUpdateBookModal}
        onSubmit={handleUpdateBookSubmit}
        book={selectedBook}
      />)}

      {selectedBook && (<DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleDeleteBookSubmit}
        type="book"
        name={selectedBook ? selectedBook.book_name : ''}
      />)}

    </div>
  );
};

export default Books;
