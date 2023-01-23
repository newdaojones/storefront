import React, {useState} from 'react';
import logoIcon from "../../assets/images/logo.svg";
import {payLink} from "../../utils/link_utils";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentOrder, selectMerchantInfo} from "../../store/selector";
import {toast} from "react-toastify";
import {IOrder, OrderPaymentMethod} from "../../models";
import {isBlockchainTestnetMode} from "../../config/appconfig";
import {userAction} from "../../store/actions";
import {getAccountChainId, isNumeric} from "../../utils";
import {useWalletConnectClient} from "../../contexts/walletConnect";

const feesPercentage = 0.0499;

export const CreateOrderPage = () => {
  const dispatch = useDispatch();
  let merchantInfo = useSelector(selectMerchantInfo);
  const { account } = useWalletConnectClient();
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [amountValue, setAmountValue] = useState(0);
  const [tip, setTip] = useState(0);
  const [fees, setFees] = useState(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);


  const [orderDescription, setOrderDescription] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);
  const [customerPhone, setCustomerPhone] = useState<string | null>(null);
  const defaultPaymentMethod = OrderPaymentMethod.TRANSAK;
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>(defaultPaymentMethod);
  let currentOrder = useSelector(selectCurrentOrder);

  function handleCreateOrder() {
    if (!orderId) {
      setOrderId("0")
      // toast.error("Order Id must be valid");
      // return;
    }
    if (!isNumeric(amount)) {
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

      const paymentProvider = paymentMethod

      if (customerPhoneNumber && (paymentProvider === OrderPaymentMethod.ONRAMPER || paymentProvider === OrderPaymentMethod.TRANSAK) && amountNumber < 30) {
        toast.error("Amount must be at least $30 to use the selected FIAT provider");
        return;
      }

      const orderInstance: IOrder = {
        amount: Number(fixedNumber),
        tip: tip,
        fees: fees,
        externalOrderId: orderId,
        testnet: isBlockchainTestnetMode(),
        token: "USD",
        toAddress: merchantInfo?.memberAddress,
        transactionHash: null,
        nativeAmount: null,
        orderDescription: orderDescription,
        chainId: chainId,
        customerPhoneNumber: customerPhoneNumber,
        paymentProvider: paymentProvider,
      };
      console.info(`creating order ${orderInstance}`);
      dispatch(userAction.createOrder(orderInstance));
      setOrderCreated(true);
      toast.info("Creating order...", {autoClose: 1500})

    } catch (e) {
      console.warn(`error parsing amount: ${amount} -> ${e}`)
      return;
    }
  }

  React.useEffect(() => {
    if (currentOrder && orderCreated) {
      if (!currentOrder?.trackingId) {
        console.error("Failed. Order trackingId must be valid")
        return;
      }
      const linkUrl = payLink(currentOrder?.trackingId);
      console.info(`redirecting to order pay link ${linkUrl}`);
      dispatch(userAction.unsetCurrentOrder())
      setOrderCreated(false);

      //clear the form fields after success
      setOrderId('');
      setAmount('');
      setAmountValue(0);
      setTip(0);
      setTotalAmount(0);
      setOrderDescription('');
      setCustomerPhone('');
      window.open(linkUrl, "_blank");
    }
  }, [currentOrder, orderCreated, dispatch]);


  const updateCalculatedFields = (amountValue: number, tip: number) => {
    console.info(`updateCalculatedFields amount: ${amount}`);
    const calcFees = feesPercentage * (amountValue + tip);
    console.info(`setting fees = ${calcFees}`);
    setFees(calcFees);

    const totalAmount = amountValue + calcFees + tip;

    try {
      console.info(`setting totalAmount = ${totalAmount}. fixed: ${totalAmount.toFixed(4)} amountValue: ${amountValue}`);
      setTotalAmount(totalAmount);
    }  catch (e) {
      console.warn(`can't parse totalAmount ${totalAmount} for amountValue: ${amountValue}`);
    }

  }

  const updateAmountValue = () => {
    try {
      const amountNumber: number = Number(amount);
      setAmountValue(amountNumber);
    } catch (e) {
      console.warn(`can't parse amount ${amount}`);
      setAmountValue(0);
    }
  }

  const handleChange = (event: any) => {
    console.info(`handleChange for ${event.target.name}`)
    if (event.target.name === "orderId") {
      console.info(`setting orderId ${event.target.value}`);
      setOrderId(event.target.value);
    } else if (event.target.name === "amount") {
      console.info(`setting amount ${event.target.value}`);
      setAmount(event.target.value);
      updateAmountValue();
      updateCalculatedFields(amountValue, tip);
    } else if (event.target.name === "tip") {
      console.info(`setting tip ${event.target.value}`);
      setTip(event.target.value);
      //FIXME updateCalculatedFields();
    } else if (event.target.name === "orderDescription") {
      setOrderDescription(event.target.value);
    } else if (event.target.name === "customerPhone") {
      setCustomerPhone(event.target.value);
    } else if (event.target.name === "paymentMethod") {
      setPaymentMethod(event.target.value);
    } else {
      console.info(`unhandled event name ${event.toString()}`)
    }


  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 h-3/4 flex justify-center bg-contentBackground border-4 border-secondary rounded-10xl shadow-md p-20">
        <div className="flex flex-col items-center justify-center mt-10">
          <p className=" text-center text-xl font-bold font-righteous text-center">Create Order</p>
          <p className=" text-sm">{isBlockchainTestnetMode() ? 'Test Money' : 'Real Money'}</p>

          {/*<div className="w-full flex items-center justify-between mt-10">*/}
          {/*  <p className="w-full ">Order ID</p>*/}
          {/*  <input id='orderId' name='orderId' placeholder="Your order ID" type="text"*/}
          {/*         value={orderId}*/}
          {/*         className="w-3/5 bg-white  bg-opacity-25 py-1 px-2 rounded" onChange={handleChange}/>*/}
          {/*</div>*/}

          <div className="w-full flex items-center justify-between mt-10">
            <p className="w-full">Subtotal (USD)</p>
            <input id='amount' name='amount' value={amount} min="0.01" max="399.99" type="number"
                   className="w-3/5 bg-white bg-opacity-25 py-1 px-2 rounded" autoComplete="off" onChange={handleChange}/>
          </div>

          <div className="w-full flex items-center justify-between mt-10 hidden">
            <p className="w-full ">Tip</p>
            <input id='tip' name='tip' value={tip} placeholder="0.50" step='0.50' min="0.01" max="399.99" type="number"
                   className="w-3/5 bg-white  bg-opacity-25 py-1 px-2 rounded" autoComplete="off" onChange={handleChange}/>
          </div>

          <div className="w-full flex items-center justify-between mt-10">
            <p className="w-full ">Fees</p>
            <input id='fees' name='fees' value={fees ? fees.toFixed(4) : '0'} type="number"
                   className="w-3/5 bg-white  bg-opacity-25 py-1 px-2 rounded" autoComplete="off" readOnly={true}/>
          </div>

          <div className="w-full flex items-center justify-between mt-10">
            <p className="w-full ">Total (USD)</p>
            <input id='totalAmount' name='totalAmount' value={totalAmount ? totalAmount.toFixed(4): '-'} type="number"
                   className="w-3/5 bg-white bg-opacity-25 py-1 px-2 rounded" readOnly={true}/>
          </div>

          <div className="w-full flex items-center justify-between mt-10">
            <p className="w-full ">Customer Phone</p>
            <input id='customerPhone' name='customerPhone' value={customerPhone ?? ''} type="tel"
                   style={{alignItems: 'end'}} placeholder="+1234567890"
                   className="w-3/5 bg-white  bg-opacity-25 py-1 px-2 rounded " autoComplete="off" onChange={handleChange}/>
          </div>

          {customerPhone && customerPhone.length > 0 && <div className="w-full flex items-center justify-between mt-10">
            <p className="w-full ">Fiat Provider</p>
            <select  id='paymentMethod' name='paymentMethod' style={{alignItems: 'end'}}
                     className="w-3/5 bg-white  bg-opacity-25 py-1 px-2 rounded " onChange={handleChange}>
              <option>{OrderPaymentMethod.TRANSAK}</option>
              <option>{OrderPaymentMethod.ONRAMPER}</option>
              <option>{OrderPaymentMethod.WYRE}</option>
            </select>
          </div>}

          {/*<div className="w-full flex items-center justify-between mt-10">*/}
          {/*  <p className="text-center text-white mr-8">Description</p>*/}
          {/*  <textarea id='orderDescription' name='orderDescription' value={orderDescription} placeholder="Order description" className="w-4/5 bg-white text-white bg-opacity-25 py-1 px-2 rounded" onChange={handleChange}/>*/}
          {/*</div>*/}

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
