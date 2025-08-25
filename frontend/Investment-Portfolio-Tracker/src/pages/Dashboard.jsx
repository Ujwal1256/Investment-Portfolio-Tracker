import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPortfolios } from "../redux/slices/portfolioSlice";
import { fetchAssets, deleteAsset } from "../redux/slices/assetsSlice";
import AssetForm from "../components/AssetForm";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { portfolios, loading: portfoliosLoading } = useSelector(
    (state) => state.portfolios
  );
  const { assets, loading: assetsLoading } = useSelector(
    (state) => state.assets
  );

  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null); 

  // fetch portfolios when dashboard mounts
  useEffect(() => {
    dispatch(fetchPortfolios());
  }, [dispatch]);

  // auto select latest portfolio once portfolios are loaded
  useEffect(() => {
    if (portfolios.length > 0 && !selectedPortfolio) {
      const latestPortfolio = portfolios[portfolios.length - 1];
      setSelectedPortfolio(latestPortfolio._id);
      dispatch(fetchAssets(latestPortfolio._id));
    }
  }, [portfolios, selectedPortfolio, dispatch]);

  // when user changes portfolio manually
  const handlePortfolioChange = (e) => {
    const portfolioId = e.target.value;
    setSelectedPortfolio(portfolioId);
    dispatch(fetchAssets(portfolioId));
  };

  // handle delete asset
  const handleDeleteAsset = (id) => {
    dispatch(deleteAsset(id))
      .unwrap()
      .then(() => {
        dispatch(fetchAssets(selectedPortfolio));
      });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      {/* Portfolio Selection */}
      <div>
        <label className="block mb-2 font-semibold">Select Portfolio:</label>
        {portfoliosLoading ? (
          <p>Loading portfolios...</p>
        ) : (
          <select
            className="border p-2 rounded"
            value={selectedPortfolio || ""}
            onChange={handlePortfolioChange}
          >
            {portfolios.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Assets Table */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Assets</h2>
          <button
            onClick={() => {
              setAssetToEdit(null); // ✅ reset if adding
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Add Asset
          </button>
        </div>

        {assetsLoading ? (
          <p>Loading assets...</p>
        ) : assets.length === 0 ? (
          <p>No assets found for this portfolio.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Type</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Purchase Price</th>
                <th className="border p-2">Current Price</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a._id}>
                  <td className="border p-2">{a.type}</td>
                  <td className="border p-2">{a.name}</td>
                  <td className="border p-2">{a.quantity}</td>
                  <td className="border p-2">{a.purchasePrice}</td>
                  <td className="border p-2">{a.currentPrice}</td>
                  <td className="border p-2 flex gap-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        setAssetToEdit(a); // ✅ load data into form
                        setShowModal(true);
                      }}
                    >
                      ✏️ Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteAsset(a._id)}
                    >
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <AssetForm
              onClose={() => setShowModal(false)}
              asset={assetToEdit} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
