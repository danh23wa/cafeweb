using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonHangController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DonHangController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _context.DonHang.ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpGet("{makhachhang}")]
        public async Task<IActionResult> GetByMaKhachHang(int makhachhang)
        {
            try
            {
                var result = await _context.DonHang
                    .Where(d => d.MaKhachHang == makhachhang)
                    .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DonHangRequest request)
        {
            if (request.MaKhachHang <= 0 || request.TongTien <= 0 || string.IsNullOrEmpty(request.DiaChi))
                return BadRequest(new { error = "MaKhachHang, TongTien và DiaChi là bắt buộc" });

            try
            {
                var donHang = new DonHang
                {
                    MaKhachHang = request.MaKhachHang,
                    TongTien = request.TongTien,
                    DiaChi = request.DiaChi,
                    TrangThai = request.TrangThai ?? "Chưa thanh toán"
                };
                _context.DonHang.Add(donHang);
                await _context.SaveChangesAsync();
                return StatusCode(201, new { MaDonHang = donHang.MaDonHang });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DonHangUpdateRequest request)
        {
            if (string.IsNullOrEmpty(request.TrangThai))
                return BadRequest(new { error = "Trạng thái là bắt buộc" });

            try
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();
                var donHang = await _context.DonHang.FindAsync(id);
                if (donHang == null)
                    return NotFound(new { error = "Không tìm thấy đơn hàng" });

                donHang.TrangThai = request.TrangThai;
                var paymentStatus = request.TrangThai == "thanh toán thành công" ? "thanh toán thành công" : "chưa thanh toán";
                var thanhToan = await _context.ThanhToan.FirstOrDefaultAsync(t => t.MaDonHang == id);
                if (thanhToan != null)
                    thanhToan.TrangThai = paymentStatus;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok(new { message = "Cập nhật trạng thái đơn hàng và thanh toán thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }
    }

    public class DonHangRequest
    {
        public int MaKhachHang { get; set; }
        public decimal TongTien { get; set; }
        public string DiaChi { get; set; }
        public string? TrangThai { get; set; }
    }

    public class DonHangUpdateRequest
    {
        public string TrangThai { get; set; }
    }
}