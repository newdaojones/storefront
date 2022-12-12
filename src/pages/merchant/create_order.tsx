import React, {useState} from 'react';
import logoIcon from "../../assets/images/logo.svg";
import {payLink} from "../../utils/link_utils";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentOrder, selectMerchantInfo} from "../../store/selector";
import {toast} from "react-toastify";
import {IOrder} from "../../models";
import {isTestnetMode} from "../../config/appconfig";
import {userAction} from "../../store/actions";
import {getAccountChainId, isNumeric} from "../../utils";
import {useWalletConnectClient} from "../../contexts/walletConnect";

export const CreateOrderPage = () => {
  const dispatch = useDispatch();
  let merchantInfo = useSelector(selectMerchantInfo);
  const { account } = useWalletConnectClient();
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [orderDescription, setOrderDescription] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);
  const [customerPhone, setCustomerPhone] = useState<string | null>(null);
  let currentOrder = useSelector(selectCurrentOrder);

  function handleCreateOrder() {
    if (!orderId) {
      toast.error("Order Id must be valid");
      return;
    }
    if (!isNumeric(amount )) {
      toast.error("Amount must be a decimal greater than zero");
      return;
    }

    if (!merchantInfo?.memberAddress) {
      toast.error("Merchant address is not valid");
      return;
    }

    if (!account) {
      toast.error("Account address is not valid. Please re-try");
      return;
    }

    try {
      const amountNumber: number = Number(amount);

      if (!amountNumber || amountNumber <= 0) {
        toast.error("Amount must be greater than zero");
        return;
      }
      if (amountNumber < 0.01) {
        toast.error("Amount must be at least 0.01");
        return;
      }
      const fixedNumber = amountNumber.toFixed(4) //need to avoid '.01' entry which will be considered 0 in backend
      const chainId = getAccountChainId(account);

      const customerPhoneNumber = customerPhone && customerPhone.length > 0 ? customerPhone : null;

      let orderInstance: IOrder = {
        amount: Number(fixedNumber),
        externalOrderId: orderId,
        testnet: isTestnetMode(),
        token: "USD",
        toAddress: merchantInfo?.memberAddress,
        transactionHash: null,
        nativeAmount: null,
        orderDescription: orderDescription,
        chainId: chainId,
        customerPhoneNumber: customerPhoneNumber,
      };
      console.info(`creating order ${orderInstance}`);
      dispatch(userAction.createOrder(orderInstance));
      setOrderCreated(true);

    } catch (e) {
      console.warn(`error parsing amount: ${amount} -> ${e}`)
      return;
    }
  }

  React.useEffect(() => {
    if (currentOrder && orderCreated) {
      if (!currentOrder?.trackingId) {
        toast.error("Order trackingId must be valid")
        return;
      }
      const linkUrl = payLink(currentOrder?.trackingId);
      console.info(`redirecting to order pay link ${linkUrl}`);
      dispatch(userAction.unsetCurrentOrder())
      setOrderCreated(false);

      //clear the form fields after success
      setOrderId('');
      setAmount('');
      setOrderDescription('');
      window.open(linkUrl, "_blank");
    }
  }, [currentOrder, orderCreated, dispatch]);



  const handleChange = (event: any) => {
    if (event.target.name === "orderId") {
      console.info(`setting orderId ${event.target.value}`);
      setOrderId(event.target.value);
    } else if (event.target.name === "amount") {
      console.info(`setting amount ${event.target.value}`);
      setAmount(event.target.value);
    } else if (event.target.name === "orderDescription") {
      setOrderDescription(event.target.value);
    } else if (event.target.name === "customerPhone") {
      setCustomerPhone(event.target.value);
    } else {
      console.info(`unhandled event name ${event.toString()}`)
    }

  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 h-3/4 flex justify-center bg-black bg-opacity-50 border-2 border-secondary rounded-16xl shadow-md p-20">
        <div className="flex flex-col items-center justify-center mt-10">
          <p className="text-white text-center text-xl font-bold font-righteous text-center">Create Order</p>
          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-white">Order ID</p>
            <input id='orderId' name='orderId' placeholder="Your order ID" type="text"
                   value={orderId}
                   className="w-2/5 bg-white text-white bg-opacity-25 py-1 px-2 rounded" onChange={handleChange}/>
          </div>
          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-white">Order Value (USD)</p>
            <input id='amount' name='amount' value={amount} placeholder="0.50" step='0.50' min="0.01" max="399.99" type="number" className="w-2/5 bg-white text-white bg-opacity-25 py-1 px-2 rounded" onChange={handleChange}/>
          </div>

          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-white">Customer Phone</p>
            <input id='customerPhone' name='customerPhone' value={customerPhone ?? ''} type="tel" className="w-2/5 bg-white text-white bg-opacity-25 py-1 px-2 rounded" onChange={handleChange}/>
          </div>

          <div className="w-full flex items-center justify-between mt-10">
            <p className="text-center text-white mr-8">Description</p>
            <textarea id='orderDescription' name='orderDescription' value={orderDescription} placeholder="Order description" className="w-4/5 bg-white text-white bg-opacity-25 py-1 px-2 rounded" onChange={handleChange}/>
          </div>

          <div className="mt-10">
            <button onClick={handleCreateOrder} className="flex bg-white justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden mt-4">
              <img className="w-8 h-8 mr-4" src={logoIcon} alt="" />
              <p className="font-righteous">Create Order</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
