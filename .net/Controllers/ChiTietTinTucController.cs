using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChiTietTinTucController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChiTietTinTucController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                Console.WriteLine($"Fetching ChiTietTinTuc for TinTucId={id}");
                var result = await _context.ChiTietTinTuc
                    .Where(ct => ct.TinTucId == id)
                    .Include(ct => ct.TinTuc)
                    .Select(ct => new
                    {
                        id = ct.Id,
                        tin_tuc_id = ct.TinTucId,
                        noi_dung = ct.NoiDung,
                        danh_sach_san_pham = ct.DanhSachSanPham,
                        ma_khuyen_mai = ct.MaKhuyenMai,
                        thoi_gian_ap_dung = ct.ThoiGianApDung,
                        lien_ket = ct.LienKet,
                        hinh_anh = ct.HinhAnh
                    })
                    .ToListAsync();

                if (result.Count == 0)
                {
                    Console.WriteLine("No ChiTietTinTuc found");
                    return NotFound(new { error = "Không tìm thấy chi tiết tin tức" });
                }

                Console.WriteLine($"Retrieved {result.Count} ChiTietTinTuc records");
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetById: {ex.Message}\nStackTrace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ChiTietTinTucRequest request)
        {
            if (string.IsNullOrEmpty(request.tin_tuc_id.ToString()) || request.tin_tuc_id == 0 || string.IsNullOrEmpty(request.noi_dung))
                return BadRequest(new { error = "tin_tuc_id và noi_dung là bắt buộc" });

            try
            {
                Console.WriteLine($"Creating ChiTietTinTuc: TinTucId={request.tin_tuc_id}");
                var tinTuc = await _context.TinTuc.FindAsync(request.tin_tuc_id);
                if (tinTuc == null)
                {
                    Console.WriteLine("TinTuc not found");
                    return BadRequest(new { error = "Không tìm thấy tin tức với tin_tuc_id cung cấp" });
                }

                var chiTietTinTuc = new ChiTietTinTuc
                {
                    TinTucId = request.tin_tuc_id,
                    NoiDung = request.noi_dung,
                    DanhSachSanPham = request.danh_sach_san_pham,
                    MaKhuyenMai = request.ma_khuyen_mai,
                    ThoiGianApDung = request.thoi_gian_ap_dung,
                    LienKet = request.lien_ket,
                    HinhAnh = request.hinh_anh
                };

                _context.ChiTietTinTuc.Add(chiTietTinTuc);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Created ChiTietTinTuc: Id={chiTietTinTuc.Id}");

                return StatusCode(201, new
                {
                    id = chiTietTinTuc.Id,
                    tin_tuc_id = chiTietTinTuc.TinTucId,
                    noi_dung = chiTietTinTuc.NoiDung,
                    danh_sach_san_pham = chiTietTinTuc.DanhSachSanPham,
                    ma_khuyen_mai = chiTietTinTuc.MaKhuyenMai,
                    thoi_gian_ap_dung = chiTietTinTuc.ThoiGianApDung,
                    lien_ket = chiTietTinTuc.LienKet,
                    hinh_anh = chiTietTinTuc.HinhAnh
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Create: {ex.Message}\nStackTrace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ChiTietTinTucRequest request)
        {
            if (string.IsNullOrEmpty(request.tin_tuc_id.ToString()) || request.tin_tuc_id == 0 || string.IsNullOrEmpty(request.noi_dung))
                return BadRequest(new { error = "tin_tuc_id và noi_dung là bắt buộc" });

            try
            {
                Console.WriteLine($"Updating ChiTietTinTuc: Id={id}");
                var chiTietTinTuc = await _context.ChiTietTinTuc.FindAsync(id);
                if (chiTietTinTuc == null)
                {
                    Console.WriteLine("ChiTietTinTuc not found");
                    return NotFound(new { error = "Không tìm thấy chi tiết tin tức" });
                }

                var tinTuc = await _context.TinTuc.FindAsync(request.tin_tuc_id);
                if (tinTuc == null)
                {
                    Console.WriteLine("TinTuc not found");
                    return BadRequest(new { error = "Không tìm thấy tin tức với tin_tuc_id cung cấp" });
                }

                chiTietTinTuc.TinTucId = request.tin_tuc_id;
                chiTietTinTuc.NoiDung = request.noi_dung;
                chiTietTinTuc.DanhSachSanPham = request.danh_sach_san_pham;
                chiTietTinTuc.MaKhuyenMai = request.ma_khuyen_mai;
                chiTietTinTuc.ThoiGianApDung = request.thoi_gian_ap_dung;
                chiTietTinTuc.LienKet = request.lien_ket;
                chiTietTinTuc.HinhAnh = request.hinh_anh;

                await _context.SaveChangesAsync();
                Console.WriteLine("ChiTietTinTuc updated successfully");

                return Ok(new
                {
                    id = chiTietTinTuc.Id,
                    tin_tuc_id = chiTietTinTuc.TinTucId,
                    noi_dung = chiTietTinTuc.NoiDung,
                    danh_sach_san_pham = chiTietTinTuc.DanhSachSanPham,
                    ma_khuyen_mai = chiTietTinTuc.MaKhuyenMai,
                    thoi_gian_ap_dung = chiTietTinTuc.ThoiGianApDung,
                    lien_ket = chiTietTinTuc.LienKet,
                    hinh_anh = chiTietTinTuc.HinhAnh
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
                Console.WriteLine($"Deleting ChiTietTinTuc: Id={id}");
                var chiTietTinTuc = await _context.ChiTietTinTuc.FindAsync(id);
                if (chiTietTinTuc == null)
                {
                    Console.WriteLine("ChiTietTinTuc not found");
                    return NotFound(new { error = "Không tìm thấy chi tiết tin tức" });
                }

                _context.ChiTietTinTuc.Remove(chiTietTinTuc);
                await _context.SaveChangesAsync();
                Console.WriteLine("ChiTietTinTuc deleted successfully");

                return Ok(new { message = "Xóa chi tiết tin tức thành công" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Delete: {ex.Message}\nStackTrace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }
    }

    public class ChiTietTinTucRequest
    {
        public int tin_tuc_id { get; set; }
        public string noi_dung { get; set; }
        public string? danh_sach_san_pham { get; set; }
        public string? ma_khuyen_mai { get; set; }
        public string? thoi_gian_ap_dung { get; set; }
        public string? lien_ket { get; set; }
        public string? hinh_anh { get; set; }
    }
}