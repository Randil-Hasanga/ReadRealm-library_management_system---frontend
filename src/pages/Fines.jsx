import { useEffect, useState } from "react";
import FineService from "../services/FineService";
import Table from "../components/Table";
import Loader from "../components/Loader";
import Icon from "../components/Icon";
import Pagination from "../components/Pagination"; // Import Pagination Component
import PayFineConfirmationDialog from "../components/PayFineConfirmationDialog";

const Fines = () => {
  const [fines, setFines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFine, setSelectedFine] = useState(null);
  const [isPayFineDialogOpen, setIsPayFineDialogOpen] = useState(false);

  // Fetch books from the API on initial load
  useEffect(() => {
    const fetchFines = async () => {
      try {
        const data = await FineService.getFines();
        setFines(data);
      } catch (error) {
        console.error(`Error fetching books: ${error}`);
        setErrorMessage('Failed to fetch books.');
      } finally {
        setLoading(false);
      }
    };
    fetchFines();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFines = fines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(fines.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Table columns for books
  const columns = [
    { label: "Book Name", field: "Book_Name" },
    { label: "Borrower Name", field: "BorrowerFullName" },
    { label: "Borrower Email", field: "BorrowerEmail" },
    { label: "Borrower Phone", field: "BorrowerContact" },
    { label: "Borrowed Date", field: "BorrowedDate" },
    { label: "Due Date", field: "DueDate" },
    { label: "Fine Amount (LKR)", field: "fine_amount" }

  ];

  const handlePayFineClick = (fine) => {
    setSelectedFine(fine);
    setIsPayFineDialogOpen(true);
  }

  const handleClosePayFineConfirmation = () => {
    setIsPayFineDialogOpen(false);
  }

  const handlePayFineSubmit = async () => {
    if (!selectedFine) return;

    setErrorMessage('');
    try {
      const fineId = selectedFine.fine_id;
      const response = await FineService.payFine(fineId);

      console.log("Fine Paid:", response);

      if (typeof (response) == 'string') {
        //show a popup message window to say someone still borrowed the book
        alert(response);
        return;
      }

      setFines((prevFines) => prevFines.filter((fine) => fine.fine_id !== fineId));

      setIsPayFineDialogOpen(false);
      setSelectedFine(null);
    } catch (error) {
      console.error(error);
    }
  };

  const renderActions = (fine) => (
    <>
      <button
        className="text-gray-500 hover:text-gray-900"
        onClick={() => handlePayFineClick(fine)}
      >
        <Icon name="Coins" color="green"/>
      </button>
    </>
  );


  return (
    <div className="p-8 bg-gray-200 min-h-screen">
      {loading && <Loader />}

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <header className="flex justify-between items-center mb-6 mt-11">
        <h1 className="text-3xl font-bold text-orange-600">Fines Management</h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by ID or Type"
            className="border rounded-md p-2 w-64"
          />
        </div>
      </header>

      <Table columns={columns} data={currentFines} renderActions={renderActions} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <PayFineConfirmationDialog
        isOpen={isPayFineDialogOpen}
        onClose={handleClosePayFineConfirmation}
        onConfirm={handlePayFineSubmit}
        type="fine"
        name={selectedFine ? selectedFine.Book_Name : ''}
        amount={selectedFine ? selectedFine.fine_amount : ''}
      />

    </div>
  );
};

export default Fines;
