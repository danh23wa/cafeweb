using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/tintuc")]
    public class TinTucController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TinTucController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                Console.WriteLine("Fetching all TinTuc...");
                var result = await _context.TinTuc
                    .Include(t => t.ChiTietTinTucs) // Tải dữ liệu liên quan nếu cần
                    .Select(t => new
                    {
                        id = t.Id,
                        tieu_de = t.TieuDe,
                        hinh_anh = t.HinhAnh,
                        ngay_tao = t.NgayTao,
                        chi_tiet_tin_tucs = t.ChiTietTinTucs.Select(c => new
                        {
                            id = c.Id,
                            noi_dung = c.NoiDung,
                            danh_sach_san_pham = c.DanhSachSanPham,
                            ma_khuyen_mai = c.MaKhuyenMai,
                            thoi_gian_ap_dung = c.ThoiGianApDung,
                            lien_ket = c.LienKet,
                            hinh_anh = c.HinhAnh
                        }).ToList()
                    })
                    .ToListAsync();
                Console.WriteLine($"Retrieved {result.Count} articles.");
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAll: {ex.Message}\nStackTrace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TinTucRequest request)
        {
            if (string.IsNullOrEmpty(request.TieuDe) || string.IsNullOrEmpty(request.HinhAnh))
                return BadRequest(new { error = "Tiêu đề và hình ảnh là bắt buộc" });

            try
            {
                Console.WriteLine($"Creating TinTuc: TieuDe={request.TieuDe}");
                var tinTuc = new TinTuc
                {
                    TieuDe = request.TieuDe,
                    HinhAnh = request.HinhAnh
                };
                _context.TinTuc.Add(tinTuc);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Created TinTuc: Id={tinTuc.Id}");
                return StatusCode(201, new
                {
                    id = tinTuc.Id,
                    tieu_de = tinTuc.TieuDe,
                    hinh_anh = tinTuc.HinhAnh,
                    ngay_tao = tinTuc.NgayTao,
                    chi_tiet_tin_tucs = tinTuc.ChiTietTinTucs
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Create: {ex.Message}\nStackTrace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TinTucRequest request)
        {
            if (string.IsNullOrEmpty(request.TieuDe) || string.IsNullOrEmpty(request.HinhAnh))
                return BadRequest(new { error = "Tiêu đề và hình ảnh là bắt buộc" });

            try
            {
                Console.WriteLine($"Updating TinTuc: Id={id}");
                var tinTuc = await _context.TinTuc.FindAsync(id);
                if (tinTuc == null)
                {
                    Console.WriteLine("TinTuc not found");
                    return NotFound(new { error = "Không tìm thấy tin tức" });
                }

                tinTuc.TieuDe = request.TieuDe;
                tinTuc.HinhAnh = request.HinhAnh;
                await _context.SaveChangesAsync();
                Console.WriteLine("TinTuc updated successfully");
                return Ok(new
                {
                    id = tinTuc.Id,
                    tieu_de = tinTuc.TieuDe,
                    hinh_anh = tinTuc.HinhAnh,
                    ngay_tao = tinTuc.NgayTao,
                    chi_tiet_tin_tucs = tinTuc.ChiTietTinTucs
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Update: {ex.Message}\nStackTrace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                Console.WriteLine($"Deleting TinTuc: Id={id}");
                var tinTuc = await _context.TinTuc.FindAsync(id);
                if (tinTuc == null)
                {
                    Console.WriteLine("TinTuc not found");
                    return NotFound(new { error = "Không tìm thấy tin tức" });
                }

                _context.TinTuc.Remove(tinTuc);
                await _context.SaveChangesAsync();
                Console.WriteLine("TinTuc deleted successfully");
                return Ok(new { message = "Xóa tin tức thành công" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Delete: {ex.Message}\nStackTrace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }
    }

    public class TinTucRequest
    {
        public string TieuDe { get; set; }
        public string HinhAnh { get; set; }
    }
}