"use client";
import { AddDisc, Bill, Order, Payment, Person } from "@/models/types";
import { getPayments } from "@/service/BillService";
import Link from "next/link";
import { useCallback, useState } from "react";
import CurrencyInput from "react-currency-input-field";

export default function Home() {
  const currencyConfig = {
    locale: "pt-BR",
    formats: {
      number: {
        BRL: {
          //style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
  };
  const [idPerson, setIdPerson] = useState<number>(1);
  const [idOrder, setIdOrder] = useState<number>(0);
  const [idAddition, setIdAddition] = useState<number>(0);
  const [idDiscount, setIdDiscount] = useState<number>(0);
  const [payments, setPayments] = useState<Payment[]>();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [item, setItem] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [priceAux, setPriceAux] = useState<string>();
  const [person, setPerson] = useState<number>(0);
  const [additionName, setAdditionName] = useState<string>();
  const [discountName, setDiscountName] = useState<string>();
  const [additionPrice, setAdditionPrice] = useState<number>();
  const [discountPrice, setDiscountPrice] = useState<number>();
  const [additionPriceAux, setAdditionPriceAux] = useState<string>();
  const [discountPriceAux, setDiscountPriceAux] = useState<string>();
  const [persons, setPersons] = useState(
    new Map<number, Person>([
      [
        0,
        {
          id: 0,
          name: " Yuri(pagador)",
          email: "yuri.b.1114@gmail.com",
          payer: true,
        },
      ],
    ])
  );
  const [orders, setOrders] = useState(new Map<number, Order>());
  const [additions, setAdditions] = useState(new Map<number, AddDisc>());
  const [discounts, setDiscounts] = useState(new Map<number, AddDisc>());
  const [loading, setLoading] = useState<boolean>(false);

  const onChangePersons = () => {
    setPersons(
      persons.set(idPerson, { id: idPerson, name, email, payer: false })
    );
    setIdPerson(idPerson + 1);
    setName("");
    setEmail("");
  };

  const onChangeOrders = () => {
    if (person != null && price && item) {
      setOrders(
        orders.set(idOrder, {
          id: idOrder,
          name: item,
          person: persons.get(person),
          price,
        })
      );
      setIdOrder(idOrder + 1);
      setPerson(0);
      setPrice(0);
      setPriceAux("");
      setItem("");
    }
  };

  const onChangeAdditions = () => {
    if (additionName && additionPrice) {
      setAdditions(
        additions.set(idAddition, {
          id: idAddition,
          name: additionName,
          price: additionPrice,
        })
      );
      setIdAddition(idAddition + 1);
      setAdditionName("");
      setAdditionPrice(0);
    }
  };

  const onChangeDiscounts = () => {
    if (discountName && discountPrice) {
      setDiscounts(
        discounts.set(idDiscount, {
          id: idDiscount,
          name: discountName,
          price: discountPrice,
        })
      );
      setIdDiscount(idDiscount + 1);
      setDiscountName("");
      setDiscountPrice(0);
    }
  };

  const onClickGerenatePayment = useCallback(() => {
    setLoading(true);
    const bill: Bill = {
      id: 0,
      orders: Array.from(orders).map(([_, value]) => value),
      additions: Array.from(additions).map(([_, value]) => value.price),
      discounts: Array.from(discounts).map(([_, value]) => value.price),
    };
    getPayments(bill, "mercado_pago").then((response) => {
      setPayments(response.payments);
      setLoading(false);
    });
  }, [additions, discounts, orders]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-[#f3f4f6]">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
        <div className="-mx-3 md:flex">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Nome*
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-2 px-4 mb-3"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              E-mail*
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-2 px-4"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="self-center mt-3">
            <button
              className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40  active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={onChangePersons}
              disabled={!name || !email}
            >
              Adicionar
            </button>
          </div>
        </div>
        <div className="mb-6">
          {Array.from(persons).map(([key, person]) => (
            <p className="ml-2" key={key}>
              {person.name} - {person.email}
            </p>
          ))}
        </div>
        <div className="-mx-3 md:flex">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Item*
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-2 px-4 mb-3"
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </div>
          <div className="md:w-1/3 px-3">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Preço*
            </label>
            <div className="intl-currency-input">
              <CurrencyInput
                decimalsLimit={2}
                onValueChange={(value, _) => {
                  if (value) {
                    setPriceAux(value);
                    setPrice(parseFloat(value.replace(",", ".")));
                  }
                }}
                value={priceAux}
              />
            </div>
          </div>
          <div className="md:w-1/3 px-3">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Pessoa*
            </label>
            <div>
              <select
                className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-2 px-4 pr-8 rounded cursor-pointer"
                value={person}
                onChange={(e) => setPerson(+e.target.value)}
              >
                {Array.from(persons).map(([key, person]) => (
                  <option className="ml-2" key={key} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="self-center mt-3">
            <button
              className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40  active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={onChangeOrders}
              disabled={!item || !price}
            >
              Adicionar
            </button>
          </div>
        </div>
        <div className="mb-6">
          {Array.from(orders).map(([key, order]) => (
            <p className="ml-2" key={key}>
              {order.name} - {order.person?.name} - R$ {order.price}
            </p>
          ))}
        </div>
        <div className="-mx-3 md:flex">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Acréscimo*
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-2 px-4 mb-3"
              type="text"
              value={additionName}
              onChange={(e) => setAdditionName(e.target.value)}
            />
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Preço*
            </label>
            <div className="intl-currency-input">
              <CurrencyInput
                decimalsLimit={2}
                onValueChange={(value, _) => {
                  if (value) {
                    setAdditionPriceAux(value);
                    setAdditionPrice(parseFloat(value.replace(",", ".")));
                  }
                }}
                value={additionPriceAux}
              />
            </div>
          </div>
          <div className="self-center mt-3">
            <button
              className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40  active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={onChangeAdditions}
              disabled={!additionName || !additionPrice}
            >
              Adicionar
            </button>
          </div>
        </div>
        <div className="mb-6">
          {Array.from(additions).map(([key, addition]) => (
            <p className="ml-2" key={key}>
              {addition.name} - R$ {addition.price}
            </p>
          ))}
        </div>
        <div className="-mx-3 md:flex">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Desconto*
            </label>
            <input
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-2 px-4 mb-3"
              type="text"
              value={discountName}
              onChange={(e) => setDiscountName(e.target.value)}
            />
          </div>
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Preço*
            </label>
            <div className="intl-currency-input">
              <CurrencyInput
                decimalsLimit={2}
                onValueChange={(value, _) => {
                  if (value) {
                    setDiscountPriceAux(value);
                    setDiscountPrice(parseFloat(value.replace(",", ".")));
                  }
                }}
                value={discountPriceAux}
              />
            </div>
          </div>
          <div className="self-center mt-3">
            <button
              className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40  active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={onChangeDiscounts}
              disabled={!discountName || !discountPrice}
            >
              Adicionar
            </button>
          </div>
        </div>
        <div className="mb-6">
          {Array.from(discounts).map(([key, discount]) => (
            <p className="ml-2" key={key}>
              {discount.name} - R$ {discount.price}
            </p>
          ))}
        </div>
        <div className="self-center mt-3">
          <button
            className="middle none center rounded-lg bg-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40  active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={onClickGerenatePayment}
            disabled={orders.size == 0}
          >
            {loading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <>Gerar Pagamento</>
            )}
          </button>
        </div>
        {payments && (
          <div className="mt-3">
            <p>Cópia enviada por email</p>
            {payments.map((payment, index) => (
              <p key={index}>
                <Link
                  href={payment.url}
                  className="text-blue-400"
                  target="_blank"
                >
                  {payment.person.name} - R$ {payment.price} - {payment.url}
                </Link>
              </p>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
