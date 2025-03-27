using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SanPhamController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SanPhamController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _context.SanPham.ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SanPhamRequest request)
        {
            if (string.IsNullOrEmpty(request.TenSanPham) || request.Gia <= 0 || request.MaLoaiSanPham <= 0 || string.IsNullOrEmpty(request.MoTa) || string.IsNullOrEmpty(request.HinhAnh))
                return BadRequest(new { error = "Dữ liệu đầu vào không hợp lệ" });

            try
            {
                var sanPham = new SanPham
                {
                    TenSanPham = request.TenSanPham,
                    Gia = request.Gia,
                    MaLoaiSanPham = request.MaLoaiSanPham,
                    MoTa = request.MoTa,
                    HinhAnh = request.HinhAnh
                };
                _context.SanPham.Add(sanPham);
                await _context.SaveChangesAsync();
                return Ok(sanPham);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SanPhamRequest request)
        {
            if (string.IsNullOrEmpty(request.TenSanPham) || request.Gia <= 0 || request.MaLoaiSanPham <= 0 || string.IsNullOrEmpty(request.MoTa) || string.IsNullOrEmpty(request.HinhAnh))
                return BadRequest(new { error = "Dữ liệu đầu vào không hợp lệ" });

            try
            {
                var sanPham = await _context.SanPham.FindAsync(id);
                if (sanPham == null)
                    return NotFound(new { error = "Không tìm thấy sản phẩm" });

                sanPham.TenSanPham = request.TenSanPham;
                sanPham.Gia = request.Gia;
                sanPham.MaLoaiSanPham = request.MaLoaiSanPham;
                sanPham.MoTa = request.MoTa;
                sanPham.HinhAnh = request.HinhAnh;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Sửa thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var sanPham = await _context.SanPham.FindAsync(id);
                if (sanPham == null)
                    return NotFound(new { error = "Không tìm thấy sản phẩm" });

                _context.SanPham.Remove(sanPham);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpGet("category/{maLoaiSanPham}")]
        public async Task<IActionResult> GetByCategory(int maLoaiSanPham)
        {
            try
            {
                var result = await _context.SanPham
                    .Where(s => s.MaLoaiSanPham == maLoaiSanPham)
                    .ToListAsync();
                return result.Any() ? Ok(result) : NotFound(new { error = "Không tìm thấy sản phẩm nào thuộc loại này" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }
    }

    public class SanPhamRequest
    {
        public string TenSanPham { get; set; }
        public decimal Gia { get; set; }
        public int MaLoaiSanPham { get; set; }
        public string MoTa { get; set; }
        public string HinhAnh { get; set; }
    }
}