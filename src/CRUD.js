import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CRUD = () => {

  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseDelete = () => setShowDelete(false);

  const handleShow = () => setShow(true);
  const handleShowDelete = () => setShowDelete(true);

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [isActive, setIsActive] = useState(false)

  const [editID, setEditID] = useState('')
  const [editName, setEditName] = useState('')
  const [editAge, setEditAge] = useState('')
  const [editIsActive, setEditIsActive] = useState(false)
  const [deleteID, setDeleteID] = useState(0);

  const [data, setData] = useState([]);

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    axios.get('https://localhost:44311/api/Employee')
      .then((result) => {
        setData(result.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }



  const handleActiveChange = (e) => {
    if (e.target.checked) {
      setIsActive(true);
    }
    else {
      setIsActive(false);
    }
  }
  const handleEditActiveChange = (e) => {
    if (e.target.checked) {
      setEditIsActive(true);
    }
    else {
      setEditIsActive(false);
    }
  }
  const handleEdit = (id) => {
    handleShow();
    axios.get(`https://localhost:44311/api/Employee/${id}`)
      .then((result) => {
        setEditName(result.data.name);
        setEditAge(result.data.age);
        setEditIsActive(result.data.isActive);
        setEditID(id);
      })
  }
  const DeleteEmployee = () => {
    axios.delete(`https://localhost:44311/api/Employee/${deleteID}`)
      .then((result) => {
        if (result.status === 200) {
          getData();
          toast.warning('Employee has been deleted');
        }
      }).catch((error) => {
        toast.error(error)
      })
    handleCloseDelete();
  }
  const handleDelete = (id) => {
    setDeleteID(id);
    handleShowDelete();
  }


  const handleUpdate = () => {
    const url = `https://localhost:44311/api/Employee`
    const data = {
      "id": editID,
      "name": editName,
      "age": editAge,
      "isActive": editIsActive
    }
    axios.put(url, data)
      .then((result) => {
        handleClose();
        getData();
        clear();
        toast.info('Employee has been Updted');
      }).catch((error) => {
        toast.error(error)
      })
  }
  const handleSave = () => {
    const url = 'https://localhost:44311/api/Employee';
    const data = {
      "name": name,
      "age": age,
      "isActive": isActive
    }
    axios.post(url, data)
      .then((result) => {
        getData();
        clear();
        toast.success('Employee has been added');
      }).catch((error) => {
        toast.error(error)
      })
  }
  const clear = () => {
    setName('');
    setAge('');
    setIsActive(0);
    setEditName('');
    setEditAge('');
    setEditIsActive(0);
    setEditID('');
  }
  return (
    <Fragment>
      <ToastContainer />
      <Container>
        <br />
        <Row>
          <Col>
            <input type="text" className="form-control" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}></input></Col>
          <Col>
            <input type="number" className="form-control" placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)} min="0"></input>
          </Col>
          <Col style={{ verticalAlign: 'center' }}>
            <input type="checkbox" style={{ margin: '5px' }}
              checked={isActive === true ? true : false}
              onChange={(e) => handleActiveChange(e)} value={isActive} />
            <label>Is Active.</label>
          </Col>
          <Col>
            <button className="btn btn-primary" onClick={() => handleSave()}>Submit</button></Col>

        </Row>
      </Container>
      <br></br>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th> Name</th>
            <th>age</th>
            <th>isActive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            data && data.length > 0 ?
              data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.age}</td>
                    <td>
                      {item.isActive === true ? (
                        <img src={require("./Resources/Active.png")} alt="Active" width="20px" height="20px" />
                      ) : (
                        <img src={require("./Resources/NotActive.png")} alt="Not Active" width="20px" height="20px" />
                      )}
                    </td>
                    <td colSpan={2}>
                      <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>Edit</button> &nbsp; | &nbsp;
                      <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                )
              })
              : 'Loading...'
          }

        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify / Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input type="text" className="form-control" placeholder="Enter Name" value={editName} onChange={(e) => setEditName(e.target.value)}></input></Col>
            <Col>
              <input type="number" className="form-control" placeholder="Enter Age" value={editAge} onChange={(e) => setEditAge(e.target.value)} min="0" ></input>
            </Col>
            <Col style={{ alignContent: 'center' }}>
              <input type="checkbox" style={{ margin: '5px' }}
                checked={editIsActive === true ? true : false} onChange={(e) => handleEditActiveChange(e)} value={editIsActive} />
              <label>Is Active.</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>

      </Modal>

      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div> Are You sure you want to delete this employee? </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-danger" onClick={DeleteEmployee}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment >
  )
}

export default CRUD; 