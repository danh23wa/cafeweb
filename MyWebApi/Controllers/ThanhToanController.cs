using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ThanhToanController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ThanhToanController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _context.ThanhToan.ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ThanhToanRequest request)
        {
            if (request.MaDonHang <= 0 || request.SoTien <= 0 || string.IsNullOrEmpty(request.TrangThai))
                return BadRequest(new { error = "Dữ liệu đầu vào không hợp lệ" });

            try
            {
                var thanhToan = new ThanhToan
                {
                    MaDonHang = request.MaDonHang,
                    SoTien = request.SoTien,
                    TrangThai = request.TrangThai
                };
                _context.ThanhToan.Add(thanhToan);
                await _context.SaveChangesAsync();
                return StatusCode(201, new { MaThanhToan = thanhToan.MaThanhToan });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPut("{maDonHang}")]
        public async Task<IActionResult> Update(int maDonHang, [FromBody] ThanhToanUpdateRequest request)
        {
            if (string.IsNullOrEmpty(request.TrangThai))
                return BadRequest(new { error = "Trạng thái là bắt buộc" });

            try
            {
                var thanhToan = await _context.ThanhToan.FirstOrDefaultAsync(t => t.MaDonHang == maDonHang);
                if (thanhToan == null)
                    return NotFound(new { error = "Không tìm thấy thanh toán" });

                thanhToan.TrangThai = request.TrangThai;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Cập nhật trạng thái thanh toán thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }
    }

    public class ThanhToanRequest
    {
        public int MaDonHang { get; set; }
        public decimal SoTien { get; set; }
        public string TrangThai { get; set; }
    }

    public class ThanhToanUpdateRequest
    {
        public string TrangThai { get; set; }
    }
}