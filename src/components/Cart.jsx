import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart({ cartItems = [], onIncrease, onDecrease, onRemove, onClear }) {
  const navigate = useNavigate();

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="w-full max-w-none px-2 sm:px-4 md:px-8 py-4 sm:py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-lg text-gray-500">Your cart is empty.</div>
      ) : (
        <>
          {/* Mobile: Card list */}
          <div className="grid grid-cols-1 gap-4 sm:hidden mb-4">
            {cartItems.map((item, idx) => (
              <div key={item._id || idx} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="font-bold text-lg flex-1">{item.name}</div>
                  <button
                    className="btn btn-outline btn-error btn-xs"
                    onClick={() => onRemove(item)}
                    aria-label="Remove item"
                  >Remove</button>
                </div>
                <div className="text-sm text-gray-500">{item.brand}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-primary font-semibold">${item.price}</div>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => onDecrease(item)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >-</button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => onIncrease(item)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  <div className="text-xs text-gray-400">Total: ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="overflow-x-auto hidden sm:block mb-4 w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Price/Unit</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.brand}</td>
                    <td>${item.price}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => onDecrease(item)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >-</button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => onIncrease(item)}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-error btn-xs"
                        onClick={() => onRemove(item)}
                        aria-label="Remove item"
                      >Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="font-bold text-lg">
              Total: <span className="text-primary">${getTotal().toFixed(2)}</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                className="btn btn-outline btn-error flex-1 sm:flex-none"
                onClick={onClear}
                aria-label="Clear all cart"
              >
                Clear Cart
              </button>
              <button
                className="btn btn-primary flex-1 sm:flex-none"
                onClick={() => navigate("/checkout")}
                aria-label="Checkout"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}

      <div>
        <Link to="/shop" className="btn btn-link">← Back to Shop</Link>
      </div>
    </div>
  );
}

export default Cart;
