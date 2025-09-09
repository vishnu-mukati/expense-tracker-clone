import ExpenseForm from "../components/Expnese/ExpenseForm";
import ExpenseList from "../components/Expnese/ExpenseList";
import { useState } from "react";

const Welcome = () => {

  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredDescription, setEnteredDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const setFormData = (item) => {

    setEnteredTitle(item.title);
    setEnteredAmount(item.amount);
    setEnteredDescription(item.description);
    setShowForm(true); // Open the form for editing
  };

  return (
    <>
      <ExpenseForm
        showForm={showForm}
        setShowForm={setShowForm}
        enteredTitle={enteredTitle}
        setEnteredTitle={setEnteredTitle}
        enteredAmount={enteredAmount}
        setEnteredAmount={setEnteredAmount}
        enteredDescription={enteredDescription}
        setEnteredDescription={setEnteredDescription}
      />
      <ExpenseList setFormData={setFormData} />
    </>
  );
}

export default Welcome;