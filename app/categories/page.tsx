"use client";
import Header from "../dashboard/Header";
import SideNav from "../dashboard/SideNav";
import { FormEventHandler, useState, useCallback, useEffect } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loading from "../dashboard/Loading";
import { MdDeleteForever } from "react-icons/md";
import {
  deleteCategory,
  getCategories,
  addCategory,
  editProduct,
} from "@/utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineEdit } from "react-icons/ai";

interface IFormInput {
  name: string;
}

interface User {
  email: string | null;
  uid: string | null;
}

interface Item {
  name: string;
  id: string;
  number_of_products: number;
}
interface ButtonProps {
  onClick: () => void;
}

interface EditingState {
  [key: string]: boolean;
}

export default function Home() {
  const [user, setUser] = useState<User>();
  const [categoryName, setCategoryName] = useState<string>("");
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const [isEditing, setIsEditing] = useState<EditingState>({});

  const onSubmit: SubmitHandler<IFormInput> = (formData, e) => {
    addCategory(formData.name);
    e?.target.reset();
  };
  // const editForm: SubmitHandler<IFormInput> = (formData, e) => {
  //   editProduct(formData.name);
  //   setIsEditing(false);
  // };

  const isUserLoggedIn = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ email: user.email, uid: user.uid });
        getCategories(setCategories);
      } else {
        return router.push("/");
      }
    });
  }, [router]);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

  const handleEditClick = (id: string, name: string) => {
    setIsEditing((prevEditingState) => ({
      ...prevEditingState,
      [id]: true,
    }));
    setCategoryName(name);
  };

  const editForm = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string,
    name: string
  ) => {
    e.preventDefault();
    console.log(id, categoryName);
    editProduct(id, name);
    setIsEditing((prevEditingState) => ({
      ...prevEditingState,
      [id]: false,
    }));

    // handleEditClick(id, name);
  };

  if (!user?.email) return <Loading />;

  return (
    <main className="flex w-full min-h-[100vh] relative">
      <SideNav />

      <div className="md:w-[85%] w-full py-4 px-6 min-h-[100vh] bg-[#f4f4f6]">
        <Header title="Categories" />

        <section className="w-full mb-10">
          <h3 className="text-lg mb-4">Add Category</h3>
          <form
            className="w-full flex items-center space-x-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className="border-b-[1px] px-4 py-2 w-1/2 rounded"
              {...register("name", { required: true, value: categoryName })}
              type="text"
              placeholder="Category"
            />

            <button
              className="py-2 px-4 bg-blue-500 text-white rounded"
              type="submit"
            >
              Add Category
            </button>
          </form>
        </section>

        <div className="w-full min-h-[30vh]">
          <h3 className="text-xl">
            Categories{" "}
            <span className="text-blue-300">({categories?.length})</span>
          </h3>

          <div>
            {categories?.map((item: Item) => (
              <div
                className="w-full bg-white p-3 flex items-center justify-between rounded my-3"
                key={item.id}
              >
                {isEditing[item.id] ? (
                  <form className="w-full flex items-center space-x-6">
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <button
                      onClick={(e) => {
                        editForm(e, item.id, categoryName);
                      }}
                    >
                      save
                    </button>
                  </form>
                ) : (
                  <p className="md:text-md text-sm">{item.name}</p>
                )}
                <div className="flex items-center space-x-5">
                  <MdDeleteForever
                    className="text-3xl text-red-500 cursor-pointer"
                    onClick={() => deleteCategory(item.id, item.name)}
                  />
                  <AiOutlineEdit
                    className="text-3xl text-blue-500 cursor-pointer"
                    onClick={() => handleEditClick(item.id, item.name)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
