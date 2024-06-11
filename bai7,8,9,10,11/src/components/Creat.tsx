import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Student {
  check: boolean;
  name: string;
  email: string;
  address: string;
  phone: number;
}

export default function Create() {
  const [student, setStudent] = useState<Student>({
    name: "",
    check: false,
    email: "",
    address: "",
    phone: 0,
  });

  const [list, setList] = useState<Student[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:8080/posts')
      .then(response => setList(response.data))
      .catch(error => console.error('Error fetching students:', error));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent(prevState => ({
      ...prevState,
      [name]: name === 'phone' ? Number(value) : value
    }));
  };

  const addStudent = () => {
    axios.post('http://localhost:8080/posts', student)
      .then(response => {
        setList(prevList => [...prevList, response.data]);
        resetForm();
      })
      .catch(error => console.error('Error adding student:', error));
  };

  const resetForm = () => {
    setStudent({
      name: "",
      check: false,
      email: "",
      address: "",
      phone: 0,
    });
  };

  const handleCheckboxChange = (index: number) => {
    setList(prevList =>
      prevList.map((item, i) =>
        i === index ? { ...item, check: !item.check } : item
      )
    );
  };

  const handleEdit = (index: number) => {
    const updatedStudent = list[index];
    const newName = prompt("Enter new name:", updatedStudent.name);
    const newAddress = prompt("Enter new address:", updatedStudent.address);
    const newEmail = prompt("Enter new email:", updatedStudent.email);
    const newPhone = prompt("Enter new phone number:", updatedStudent.phone.toString());

    const updatedList = [...list];
    updatedList[index] = {
      ...updatedStudent,
      name: newName ?? updatedStudent.name,
      address: newAddress ?? updatedStudent.address,
      email: newEmail ?? updatedStudent.email,
      phone: newPhone ? Number(newPhone) : updatedStudent.phone,
    };
    setList(updatedList);
    axios.put(`http://localhost:8080/posts/${updatedStudent.id}`, updatedList[index])
  };

  const handleDelete = (index: number) => {
    const updatedStudent = list[index];
    axios.delete(`http://localhost:8080/posts/${updatedStudent.id}`)
      .then(() => {
        setList(prevList => prevList.filter((_, i) => i !== index));
      })
  };

  return (
    <div>
      <h2>Thêm Học Sinh</h2>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Nhập tên"
          value={student.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Nhập địa chỉ"
          value={student.address}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Nhập email"
          value={student.email}
          onChange={handleChange}
        />
        <input
          type="number"
          name="phone"
          placeholder="Nhập số điện thoại"
          value={student.phone}
          onChange={handleChange}
        />
        <button onClick={addStudent}>Thêm học sinh</button>
      </div>
      <h3>Danh sách học sinh</h3>
      <div style={{ display: 'flex', flexDirection: "row", flexWrap: "wrap" }}>
        {list.map((item, index) => (
          <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
            <p>Tên: {item.name}</p>
            <p>Địa chỉ: {item.address}</p>
            <p>Email: {item.email}</p>
            <p>Số điện thoại: {item.phone}</p>
            <p><button onClick={() => handleEdit(index)}>Sửa</button></p>
            <p><button onClick={() => handleDelete(index)}>Xóa</button></p>
            <p>
              <input
                type="checkbox"
                checked={item.check}
                onChange={() => handleCheckboxChange(index)}
              />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
