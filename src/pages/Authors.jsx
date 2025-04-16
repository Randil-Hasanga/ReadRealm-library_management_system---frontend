import { useEffect, useState } from "react";
import Table from "../components/Table";
import Loader from "../components/Loader";
import Icon from "../components/Icon";
import AuthorService from "../services/AuthorService";
import AddAuthorModal from "../models/authors/AddAuthorModel";
import UpdateAuthorModal from "../models/authors/UpdateAuthorModel";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import Pagination from "../components/Pagination";
import BookService from "../services/BookService";

const Authors = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const data = await AuthorService.getAuthors();
                // Fetch book count for each author and update their data
                const authorsWithBookCount = await Promise.all(
                    data.map(async (author) => {
                        const bookCount = await BookService.getBookCountByAuthor(author.author_id);
                        return { ...author, books_count: bookCount };
                    })
                );
                setAuthors(authorsWithBookCount || []);
            } catch (err) {
                console.error(err);
                setErrorMessage("Failed to load authors");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    const handleAddClick = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleUpdateClick = (author) => {
        setSelectedAuthor(author);
        setIsUpdateModalOpen(true);
    };
    const handleCloseUpdateModal = () => {
        setSelectedAuthor(null);
        setIsUpdateModalOpen(false);
    };

    const handleDeleteClick = (author) => {
        setSelectedAuthor(author);
        setIsDeleteDialogOpen(true);
    };
    const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);

    const handleAddSubmit = async (newAuthor) => {
        try {
            await AuthorService.addAuthor(newAuthor);
            const updatedList = await AuthorService.getAuthors(true);
            setAuthors(updatedList);
            setIsAddModalOpen(false);
        } catch (err) {
            console.error("Add Error:", err);
            setErrorMessage("Failed to add author.");
        }
    };

    const handleUpdateSubmit = async (updatedAuthor) => {
        try {
            const id = selectedAuthor.author_id;
            await AuthorService.updateAuthor(id, updatedAuthor);
            const updatedList = await AuthorService.getAuthors(true);
            setAuthors(updatedList);
            setIsUpdateModalOpen(false);
        } catch (err) {
            console.error("Update Error:", err);
            setErrorMessage("Failed to update author.");
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            const id = selectedAuthor.author_id;
            await AuthorService.deleteAuthor(id);
            const updatedList = await AuthorService.getAuthors(true);
            setAuthors(updatedList);
            setIsDeleteDialogOpen(false);
        } catch (err) {
            console.error("Delete Error:", err);
            setErrorMessage("Failed to delete author.");
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(authors) ? authors.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Math.ceil(authors.length / itemsPerPage);
    const handlePageChange = (page) => setCurrentPage(page);

    const columns = [
        { label: "Author ID", field: "author_id" },
        { label: "Author Name", field: "author_name" },
        { label: "Books Count", field: "books_count" },  // Updated to include book count
    ];

    const renderActions = (author) => (
        <>
            <button onClick={() => alert(`Viewing details for ${author.author_name}`)} className="text-blue-600 hover:text-blue-800">
                <Icon name="Eye" />
            </button>
            <button onClick={() => handleUpdateClick(author)} className="text-green-600 hover:text-green-800 ml-2">
                <Icon name="RefreshCw" />
            </button>
            <button onClick={() => handleDeleteClick(author)} className="text-red-600 hover:text-red-800 ml-2">
                <Icon name="Trash2" />
            </button>
        </>
    );

    return (
        <div className="p-8 bg-gray-200 min-h-screen">
            {loading && <Loader />}
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}

            <header className="flex justify-between items-center mb-6 mt-11">
                <h1 className="text-3xl font-bold text-orange-600">Author Management</h1>
                <button onClick={handleAddClick} className="bg-orange-300 text-slate-700 px-4 py-2 rounded-md font-bold shadow-md">
                    Add Author
                </button>
            </header>

            <Table columns={columns} data={currentItems} renderActions={renderActions} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

            <AddAuthorModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSubmit={handleAddSubmit} />

            {selectedAuthor && (
                <UpdateAuthorModal
                    isOpen={isUpdateModalOpen}
                    onClose={handleCloseUpdateModal}
                    onSubmit={handleUpdateSubmit}
                    author={selectedAuthor}
                />
            )}
            {selectedAuthor && (
                <DeleteConfirmationDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                    onConfirm={handleDeleteSubmit}
                    type="author"
                    name={selectedAuthor.author_name}
                />
            )}
        </div>
    );
};

export default Authors;
