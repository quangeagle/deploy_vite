import SaleNoti from "../assets/dathongbao.png";

function footer() {
  return (
    <footer className="w-full  h-auto bg-gray-100 text-gray-700 text-[10px]">
      <div className="footer-sections ">
        <div className="bg-gray-200 ">
          <div className="footer-links  py-4 px-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ul className="footer-column sm:ml-32">
              <li><a href="https://emartmall.com.vn/index.php?route=account/customer_center">Trung tâm hỗ trợ</a></li>
              <li><a href="https://emartmall.com.vn/index.php?route=information/information&information_id=10">Quy trình giao dịch</a></li>
              <li><a href="https://emartmall.com.vn/index.php?route=information/information&information_id=14">Trách nhiệm khi phát sinh lỗi kỹ thuật</a></li>
              <li><a href="./Login.jsx">Đăng nhập</a></li>
            </ul>
            <ul className="footer-column sm:ml-32">
              <li><a href="https://emartmall.com.vn/index.php?route=information/information&information_id=5">Quy chế hoạt động</a></li>
              <li><a href="https://emartmall.com.vn/index.php?route=information/information&information_id=11">Quy trình thanh toán</a></li>
              <li><a href="#">Tải xuống ứng dụng</a></li>
            </ul>
            <ul className="footer-column">
              <li><a href="https://emartmall.com.vn/index.php?route=information/information&information_id=8">Giới thiệu</a></li>
              <li><a href="https://emartmall.com.vn/index.php?route=information/information&information_id=12">Đảm bảo an toàn giao dịch</a></li>
              <li><a href="#">Lịch sử</a></li>
            </ul>
            <ul className="footer-column">
              <li><a href="https://emartmall.com.vn/index.php?route=information/information&information_id=9">Quy định chung</a></li>
              <li><a href="https://emartmall.com.vn/index.php?route=information/information&information_id=13">Bảo vệ thông tin cá nhân</a></li>
              <li><a href="#">Sổ địa chỉ</a></li>
            </ul>
          </div>


        </div>
      </div>

      <div className="footer-info  bg-gray-900 text-white py-8 px-6 text-left text-[10px] ">
        <div className="sm:ml-32">
          <img className="footer-logo mb-4 " src={SaleNoti} alt="Công chứng" />
          <h4 className=" text-[12px]">THISO RETAIL COMPANY LIMITED</h4>
          <p >TÊN CÔNG TY : CÔNG TY TNHH THISO RETAIL</p>
          <p>Người đại diện : TRẦN BÁ DƯƠNG</p>
          <p>Mã số doanh nghiệp: 0316940306</p>
          <p>
            Giấy chứng nhận đăng ký doanh nghiệp số 0316940306 do Sở Kế hoạch và Đầu tư
            TP. HCM cấp lần đầu ngày 15/07/2021.
          </p>
          <p>
            Giấy chứng nhận cơ sở đủ điều kiện ATTP số 3717/GCNATTP-BQLATTP do Ban Quản
            lý An Toàn Thực Phẩm TP. HCM cấp ngày 28/12/2021.
          </p>
          <p>Địa chỉ: 366 Phan Văn Trị, Phường 5, Quận Gò Vấp, Tp. HCM.</p>
          <p>DVKH: (028) 3622 4567 | Email: emartmall@emart.vn</p>
        </div>
      </div>

      <div className="footer-bottom bg-gray-800 text-gray-400 py-4 px-6 text-center">
        <p>BẢN QUYỀN CỦA EMART GO VAP © 2024</p>
        <div className="footer-options flex justify-center space-x-4 mt-2">
          <a href="https://emartmall.com.vn/index.php?route=information/sitemap">SƠ ĐỒ TRANG</a>
          <a href="https://emartmall.com.vn/index.php?route=information/contact">LIÊN HỆ</a>
        </div>
      </div>
    </footer>
  );
}

export default footer;
