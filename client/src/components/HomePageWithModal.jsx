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
        <Modal.Body>ChiCommons would like to acknowledge that we are on the traditional lands of the first people of present-day Illinois and Indiana: the Potawatomi, Peoria, Kaskaskia, Miami, Mascoutin, Mesquaki, Odawa, Piankashaw, Wea, Sauk, Kickapoo, Ojibwe, Delaware, Shawnee, and Chickasaw Nations. We share gratitude for the land itself and for the people of these Nations, past and present.</Modal.Body>
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
