import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SchoolList from "../../components/SchoolsList/SchoolList";

const TestPage = () => {
  return (
    <>
      <Header />
      <main className="test-container">
        <h1>Component Testing Area</h1>
        <p>This page is for testing the SchoolList component only.</p>

        <div className="test-content">
          <SchoolList />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TestPage;
