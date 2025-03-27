using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GioHangController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GioHangController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{makhachhang}")]
        public async Task<IActionResult> GetByMaKhachHang(int makhachhang)
        {
            try
            {
                var result = await _context.GioHang
                    .Where(g => g.MaKhachHang == makhachhang)
                    .Join(_context.SanPham,
                        g => g.MaSanPham,
                        sp => sp.MaSanPham,
                        (g, sp) => new
                        {
                            g.MaKhachHang,
                            g.MaSanPham,
                            g.SoLuong,
                            sp.TenSanPham,
                            sp.Gia,
                            sp.HinhAnh
                        })
                    .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddOrUpdate([FromBody] GioHangRequest request)
        {
            if (request.MaKhachHang <= 0 || request.MaSanPham <= 0 || request.SoLuong <= 0)
                return BadRequest(new { error = "Dữ liệu đầu vào không hợp lệ" });

            try
            {
                var gioHang = await _context.GioHang
                    .FirstOrDefaultAsync(g => g.MaKhachHang == request.MaKhachHang && g.MaSanPham == request.MaSanPham);
                if (gioHang != null)
                {
                    gioHang.SoLuong += request.SoLuong;
                }
                else
                {
                    gioHang = new GioHang
                    {
                        MaKhachHang = request.MaKhachHang,
                        MaSanPham = request.MaSanPham,
                        SoLuong = request.SoLuong
                    };
                    _context.GioHang.Add(gioHang);
                }
                await _context.SaveChangesAsync();
                return StatusCode(201, new { message = "Thêm hoặc cập nhật giỏ hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpDelete("{makhachhang}/{masanpham}")]
        public async Task<IActionResult> Delete(int makhachhang, int masanpham)
        {
            try
            {
                var gioHang = await _context.GioHang
                    .FirstOrDefaultAsync(g => g.MaKhachHang == makhachhang && g.MaSanPham == masanpham);
                if (gioHang == null)
                    return NotFound(new { error = "Không tìm thấy sản phẩm trong giỏ hàng" });

                _context.GioHang.Remove(gioHang);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa sản phẩm khỏi giỏ hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }
    }

    public class GioHangRequest
    {
        public int MaKhachHang { get; set; }
        public int MaSanPham { get; set; }
        public int SoLuong { get; set; }
    }
}