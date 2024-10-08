import React, { useState, useEffect } from 'react';
import Home from './Map.js'; // Adjust the import based on where your HomePage is
import { Modal, Button } from 'react-bootstrap'; // Or use your preferred modal library

const HomePageWithModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const modalShown = sessionStorage.getItem('modalShown');
    if (!modalShown) {
      setShowModal(true);
      sessionStorage.setItem('modalShown', 'true');
    }
  }, []);

  const handleClose = () => setShowModal(false);

  return (
    <>
      <Home /> {/* Render the original home page content */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome!</Modal.Title>
        </Modal.Header>
        <Modal.Body>This popup only appears once per session.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HomePageWithModal;
