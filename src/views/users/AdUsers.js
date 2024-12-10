import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const AdUsers = () => {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại

  // Gọi API để lấy danh sách người dùng
  const fetchUsers = async (page = 0) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user/list?page=${page}&size=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(response.data.content); // Dữ liệu người dùng
      setTotalPages(response.data.totalPages); // Tổng số trang
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
    }
  };

  // Khi component mount, gọi API
  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý khi chuyển trang
  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected); // Cập nhật trang hiện tại
    fetchUsers(selected.selected); // Gọi API với trang mới
  };

  return (
    <div>
      <h1>Danh sách người dùng</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên hiển thị</th>
            <th>Email</th>
            <th>Số điện thoại</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1 + currentPage * 10}</td>
              <td>{user.displayName}</td>
              <td>{user.email}</td>
              <td>{user.phone || 'Không có số điện thoại'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <ReactPaginate
        previousLabel={'← Trước'}
        nextLabel={'Tiếp →'}
        breakLabel={'...'}
        pageCount={totalPages} // Tổng số trang
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange} // Hàm xử lý khi chuyển trang
        containerClassName={'pagination justify-content-center'} // CSS cho phân trang
        pageClassName={'page-item'} // CSS cho từng trang
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        activeClassName={'active'} // CSS cho trang hiện tại
      />
    </div>
  );
};

export default AdUsers;
