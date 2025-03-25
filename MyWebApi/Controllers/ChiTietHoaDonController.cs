using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChiTietHoaDonController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChiTietHoaDonController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _context.ChiTietHoaDon.ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpGet("donhang/{madonhang}")]
        public async Task<IActionResult> GetByDonHang(int madonhang)
        {
            try
            {
                var result = await _context.ChiTietHoaDon
                    .Where(cthd => cthd.MaDonHang == madonhang)
                    .Join(_context.SanPham,
                        cthd => cthd.MaSanPham,
                        sp => sp.MaSanPham,
                        (cthd, sp) => new
                        {
                            cthd.MaChiTietHoaDon,
                            cthd.MaDonHang,
                            cthd.MaSanPham,
                            cthd.SoLuong,
                            cthd.DonGia,
                            ThanhTien = cthd.SoLuong * cthd.DonGia,
                            sp.TenSanPham,
                            sp.HinhAnh
                        })
                    .ToListAsync();
                return result.Any() ? Ok(result) : NotFound(new { error = "Không tìm thấy chi tiết đơn hàng nào" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ChiTietHoaDonRequest request)
        {
            if (request.MaDonHang <= 0 || request.MaSanPham <= 0 || request.SoLuong <= 0 || request.DonGia < 0)
                return BadRequest(new { error = "Dữ liệu đầu vào không hợp lệ" });

            try
            {
                var chiTietHoaDon = new ChiTietHoaDon
                {
                    MaDonHang = request.MaDonHang,
                    MaSanPham = request.MaSanPham,
                    SoLuong = request.SoLuong,
                    DonGia = request.DonGia
                };
                _context.ChiTietHoaDon.Add(chiTietHoaDon);
                await _context.SaveChangesAsync();
                return StatusCode(201, new { MaChiTietHoaDon = chiTietHoaDon.MaChiTietHoaDon });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPut("{machitiethoadon}")]
        public async Task<IActionResult> Update(int machitiethoadon, [FromBody] ChiTietHoaDonUpdateRequest request)
        {
            if (request.SoLuong <= 0 || request.DonGia < 0)
                return BadRequest(new { error = "Số lượng và đơn giá phải hợp lệ" });

            try
            {
                var chiTietHoaDon = await _context.ChiTietHoaDon.FindAsync(machitiethoadon);
                if (chiTietHoaDon == null)
                    return NotFound(new { error = "Không tìm thấy chi tiết đơn hàng" });

                chiTietHoaDon.SoLuong = request.SoLuong;
                chiTietHoaDon.DonGia = request.DonGia;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Cập nhật chi tiết đơn hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpDelete("{machitiethoadon}")]
        public async Task<IActionResult> Delete(int machitiethoadon)
        {
            try
            {
                var chiTietHoaDon = await _context.ChiTietHoaDon.FindAsync(machitiethoadon);
                if (chiTietHoaDon == null)
                    return NotFound(new { error = "Không tìm thấy chi tiết đơn hàng" });

                _context.ChiTietHoaDon.Remove(chiTietHoaDon);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa chi tiết đơn hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }
    }

    public class ChiTietHoaDonRequest
    {
        public int MaDonHang { get; set; }
        public int MaSanPham { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }

    public class ChiTietHoaDonUpdateRequest
    {
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }
}