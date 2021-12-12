import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import SearchModal from "./SearchModal";

const Layout = () => {
  const [isModalActive, setIsModalActive] = useState(false);

  function handleModalToggle() {
    setIsModalActive((prevToggle) => !prevToggle);
  }

  return (
    <>
      <Head>
        <title>Yes sir - Danny Ohana</title>
      </Head>
      <Navbar
        isActive={isModalActive}
        onSearchCommandExecute={handleModalToggle}
      />
      <SearchModal isActive={isModalActive} />
    </>
  );
};

export default Layout;
