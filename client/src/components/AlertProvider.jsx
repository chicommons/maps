import React, { useState, useCallback, useContext, createContext } from "react";
import { Alert } from "reactstrap";

const AlertContext = createContext();

export function AlertProvider(props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleOpen = useCallback(
    (message) => {
      setMessage(message);
      setOpen(true);
      window.setTimeout(()=>{
        setOpen(false)
      },2000); 
    },
    [setMessage, setOpen]
  );

  return (
    <AlertContext.Provider value={[handleOpen, handleClose]}>
      <Alert color="info" isOpen={open} fade={true} style={{marginBottom: '0rem'}}>
        {message}
      </Alert>
      {props.children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context)
    throw new Error(
      "`useAlert()` must be called inside an `AlertProvider` child."
    );

  return context;
}
