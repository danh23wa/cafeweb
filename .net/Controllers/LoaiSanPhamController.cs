using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoaiSanPhamController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LoaiSanPhamController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _context.LoaiSanPham.ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var loaiSanPham = await _context.LoaiSanPham.FindAsync(id);
                if (loaiSanPham == null)
                    return NotFound(new { error = "Không tìm thấy loại sản phẩm" });
                return Ok(loaiSanPham);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LoaiSanPhamRequest request)
        {
            if (string.IsNullOrEmpty(request.TenLoaiSanPham) || string.IsNullOrEmpty(request.MoTa))
                return BadRequest(new { error = "Tên loại sản phẩm và mô tả là bắt buộc" });

            try
            {
                var loaiSanPham = new LoaiSanPham
                {
                    TenLoaiSanPham = request.TenLoaiSanPham,
                    MoTa = request.MoTa
                };
                _context.LoaiSanPham.Add(loaiSanPham);
                await _context.SaveChangesAsync();
                return StatusCode(201, new { MaLoaiSanPham = loaiSanPham.MaLoaiSanPham });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LoaiSanPhamRequest request)
        {
            if (string.IsNullOrEmpty(request.TenLoaiSanPham) || string.IsNullOrEmpty(request.MoTa))
                return BadRequest(new { error = "Tên loại sản phẩm và mô tả là bắt buộc" });

            try
            {
                var loaiSanPham = await _context.LoaiSanPham.FindAsync(id);
                if (loaiSanPham == null)
                    return NotFound(new { error = "Không tìm thấy loại sản phẩm" });

                loaiSanPham.TenLoaiSanPham = request.TenLoaiSanPham;
                loaiSanPham.MoTa = request.MoTa;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Cập nhật loại sản phẩm thành công" });
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
                var loaiSanPham = await _context.LoaiSanPham.FindAsync(id);
                if (loaiSanPham == null)
                    return NotFound(new { error = "Không tìm thấy loại sản phẩm" });

                _context.LoaiSanPham.Remove(loaiSanPham);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa loại sản phẩm thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }
    }

    public class LoaiSanPhamRequest
    {
        public string TenLoaiSanPham { get; set; }
        public string MoTa { get; set; }
    }
}