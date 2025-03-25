using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/nguoidung")]
    public class NguoiDungController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public NguoiDungController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Lấy tất cả người dùng (có thể giới hạn cho admin)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _context.NguoiDung
                    .Select(n => new
                    {
                        n.MaNguoiDung,
                        n.TenNguoiDung,
                        n.Email,
                        n.SoDienThoai,
                        n.VaiTro
                    })
                    .ToListAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        // Lấy người dùng theo MaNguoiDung
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var user = await _context.NguoiDung
                    .Where(n => n.MaNguoiDung == id)
                    .Select(n => new
                    {
                        n.MaNguoiDung,
                        n.TenNguoiDung,
                        n.Email,
                        n.SoDienThoai,
                        n.VaiTro
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                    return NotFound(new { error = "Không tìm thấy người dùng" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        // Đăng ký người dùng
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrEmpty(request.TenNguoiDung) || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.MatKhau))
                return BadRequest(new { error = "Tên người dùng, email và mật khẩu là bắt buộc" });

            try
            {
                if (await _context.NguoiDung.AnyAsync(n => n.Email == request.Email))
                    return BadRequest(new { error = "Email đã được sử dụng" });

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.MatKhau);
                var nguoiDung = new NguoiDung
                {
                    TenNguoiDung = request.TenNguoiDung,
                    SoDienThoai = request.SoDienThoai,
                    Email = request.Email,
                    MatKhau = hashedPassword,
                    VaiTro = request.VaiTro ?? "KhachHang"
                };
                _context.NguoiDung.Add(nguoiDung);
                await _context.SaveChangesAsync();
                return StatusCode(201, new { MaNguoiDung = nguoiDung.MaNguoiDung });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        // Đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.MatKhau))
                return BadRequest(new { error = "Email và mật khẩu là bắt buộc" });

            try
            {
                var user = await _context.NguoiDung.FirstOrDefaultAsync(n => n.Email == request.Email);
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.MatKhau, user.MatKhau))
                    return Unauthorized(new { error = "Email hoặc mật khẩu không đúng" });

                var secretKey = _configuration["Jwt:Secret"];
                if (string.IsNullOrEmpty(secretKey) || Encoding.UTF8.GetBytes(secretKey).Length < 32)
                {
                    secretKey = "this_is_a_very_long_secret_key_32_bytes_or_more";
                }
                var keyBytes = Encoding.UTF8.GetBytes(secretKey);

                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim("MaNguoiDung", user.MaNguoiDung.ToString()),
                        new Claim(ClaimTypes.Role, user.VaiTro ?? "KhachHang")
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);

                return Ok(new
                {
                    user.MaNguoiDung,
                    user.TenNguoiDung,
                    user.Email,
                    user.SoDienThoai,
                    user.VaiTro,
                    Token = tokenHandler.WriteToken(token)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        // Cập nhật thông tin người dùng
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRequest request)
        {
            try
            {
                var user = await _context.NguoiDung.FindAsync(id);
                if (user == null)
                    return NotFound(new { error = "Không tìm thấy người dùng" });

                // Kiểm tra email nếu thay đổi
                if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
                {
                    if (await _context.NguoiDung.AnyAsync(n => n.Email == request.Email && n.MaNguoiDung != id))
                        return BadRequest(new { error = "Email đã được sử dụng" });
                    user.Email = request.Email;
                }

                if (!string.IsNullOrEmpty(request.TenNguoiDung))
                    user.TenNguoiDung = request.TenNguoiDung;
                if (!string.IsNullOrEmpty(request.SoDienThoai))
                    user.SoDienThoai = request.SoDienThoai;
                if (!string.IsNullOrEmpty(request.VaiTro))
                    user.VaiTro = request.VaiTro;

                if (!string.IsNullOrEmpty(request.MatKhau))
                {
                    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.MatKhau);
                    user.MatKhau = hashedPassword;
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Cập nhật người dùng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        // Đổi mật khẩu
        [HttpPut("{id}/password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.MatKhauCu) || string.IsNullOrEmpty(request.MatKhauMoi))
                return BadRequest(new { error = "Mật khẩu cũ và mật khẩu mới là bắt buộc" });

            try
            {
                var user = await _context.NguoiDung.FindAsync(id);
                if (user == null)
                    return NotFound(new { error = "Không tìm thấy người dùng" });

                if (!BCrypt.Net.BCrypt.Verify(request.MatKhauCu, user.MatKhau))
                    return Unauthorized(new { error = "Mật khẩu cũ không đúng" });

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.MatKhauMoi);
                user.MatKhau = hashedPassword;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Đổi mật khẩu thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        // Xóa người dùng
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var user = await _context.NguoiDung.FindAsync(id);
                if (user == null)
                    return NotFound(new { error = "Không tìm thấy người dùng" });

                _context.NguoiDung.Remove(user);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa người dùng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }
    }

    public class RegisterRequest
    {
        public string TenNguoiDung { get; set; }
        public string? SoDienThoai { get; set; }
        public string Email { get; set; }
        public string MatKhau { get; set; }
        public string? VaiTro { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string MatKhau { get; set; }
    }

    public class UpdateRequest
    {
        public string? TenNguoiDung { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? MatKhau { get; set; }
        public string? VaiTro { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string MatKhauCu { get; set; }
        public string MatKhauMoi { get; set; }
    }
}