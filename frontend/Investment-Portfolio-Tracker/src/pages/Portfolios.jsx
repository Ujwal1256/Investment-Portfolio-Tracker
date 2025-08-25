import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPortfolios, deletePortfolio } from "../redux/slices/portfolioSlice";
import PortfolioForm from "../components/PortfolioForm";

function Portfolios() {
  const dispatch = useDispatch();
  const { portfolios, loading } = useSelector((state) => state.portfolios);
  const user = useSelector((state) => state.auth.user);
  // console.log(user);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);

 useEffect(() => {
  if (user?._id) {
    dispatch(fetchPortfolios(user._id));
  }
}, [dispatch, user]);
  const openAddModal = () => {
    setEditingPortfolio(null);
    setModalOpen(true);
  };

  const startEdit = (portfolio) => {
    setEditingPortfolio(portfolio);
    setModalOpen(true);
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this portfolio?")) {
      dispatch(deletePortfolio(id));
    }
  };

  const onSave = () => {
    setEditingPortfolio(null);
    setModalOpen(false);
    dispatch(fetchPortfolios());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">Your Portfolios</h1>
          <button
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            ➕ Add Portfolio
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-600 animate-pulse">Loading portfolios...</p>
        )}

        {/* Portfolio Cards */}
        {!loading && portfolios.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-md p-5 transition transform hover:scale-105 hover:shadow-2xl"
              >
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                  {p.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {p.description || "No description"}
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => startEdit(p)}
                    className="flex-1 bg-indigo-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
                  >
                    ✏️ Update
                  </button>
                  <button
                    onClick={() => deleteHandler(p._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Portfolios */}
        {!loading && portfolios.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg font-medium">
            No Portfolios Found
          </p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">
              {editingPortfolio ? "Update Portfolio" : "Add Portfolio"}
            </h2>

            <PortfolioForm existingPortfolio={editingPortfolio} onSave={onSave} />

            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Portfolios);
