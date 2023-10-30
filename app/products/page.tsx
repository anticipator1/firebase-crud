"use client";
import SideNav from "../dashboard/SideNav";
import { MdDeleteForever } from "react-icons/md";
import Header from "../dashboard/Header";
import React, {
  FormEventHandler,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loading from "../dashboard/Loading";
import {
  addProduct,
  deleteProduct,
  getCategories,
  getProducts,
  User,
  Item,
} from "@/utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  name: string;
  price: number;
  category: string;
}

interface Product {
  id: string;
  category: string;
  price: number | string;
  quantity: number;
  name: string;
}

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: ({ cell }) => `Nrs ${cell.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor("category", {
    header: "Category",
  }),
  columnHelper.display({
    id: "actions",
    //@ts-ignore
    accessorFn: (row: Product) => row,
    header: "Action",
    cell: ({ cell }) => {
      const row: any = cell.getValue();

      return (
        <MdDeleteForever
          className="text-3xl text-red-500 cursor-pointer"
          onClick={() => deleteProduct(row.id, row.name)}
        />
      );
    },

    // cell: ({ cell }) =>{
    //     const row = cell.getValue();
    //     console.log(row.id)
    // }
  }),
];

export default function Home() {
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState<string>("");
  const [price, setPrice] = useState<number>(100);
  const [category, setCategory] = useState<string>("select");
  const [products, setProducts] = useState([]);
  const { register, handleSubmit, getValues } = useForm<IFormInput>();

  const transformedProducts = useMemo(() => {
    if (!products) return [];

    return products.map((product) => product);
  }, [products]);

  const tableInstance = useReactTable({
    columns,
    data: transformedProducts ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  const isUserLoggedIn = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email, uid: user.uid });
        getCategories(setCategories);
        getProducts(setProducts);
      } else {
        return router.push("/");
      }
    });
  }, [router]);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

  if (!user?.email) return <Loading />;

  const onSubmit: SubmitHandler<IFormInput> = (formData) => {
    addProduct(formData.name, formData.price, formData.category);

    setCategory("select");
    setPrice(100);
    setProduct("");
  };

  // const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
  //   e.preventDefault();
  //   addProduct(product, price, category);
  //   setCategory("select");
  //   setPrice(100);
  //   setProduct("");
  // };

  const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setPrice(value);
  };

  return (
    <main className="flex w-full min-h-[100vh] relative">
      <SideNav />

      <div className="md:w-[85%] w-full py-4 px-6 min-h-[100vh] bg-[#f4f4f6]">
        <Header title="Products" />

        <section className="w-full mb-10">
          <h3 className="text-lg mb-4">
            Add Product{" "}
            <span className="text-gray-500 text-sm">
              (name, price, category)
            </span>
          </h3>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between space-x-3 mb-4">
              <input
                className="border-b-[1px] px-4 py-2 w-1/3 rounded"
                {...register("name", { required: true, value: product })}
                type="text"
                placeholder="Product"
                required
              />

              <input
                className="border-b-[1px] px-4 py-2 w-1/3 rounded"
                {...register("price", {
                  required: true,
                  value: price,
                })}
                type="number"
                placeholder="Price"
                required
              />

              <select
                className="border-b-[1px] px-4 py-2 w-1/3"
                {...register("category", {
                  required: true,
                  value: category,
                })}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="select">Select Category</option>
                {categories?.map((item: Item) => (
                  <option value={item.name} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {category !== "select" ? (
              <button className="py-2 px-4 bg-blue-500 text-white rounded">
                ADD PRODUCT
              </button>
            ) : (
              <p className="text-red-400 text-sm">
                You need to pick a category
              </p>
            )}
          </form>
        </section>

        <div className="w-full">
          <table className="w-full border-collapse table-auto">
            <thead>
              {tableInstance.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      colSpan={header.colSpan}
                      key={header.id}
                      className="cursor-pointer font-bold"
                    >
                      <div className="flex items-center justify-between gap-6 font-bold">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {tableInstance.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
