using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/stores")]
    public class StoreController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StoreController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _context.Stores.ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string address)
        {
            if (string.IsNullOrEmpty(address))
                return BadRequest(new { error = "Vui lòng cung cấp địa chỉ" });

            try
            {
                var result = await _context.Stores
                    .Where(s => s.Address.Contains(address))
                    .ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StoreRequest request)
        {
            if (string.IsNullOrEmpty(request.StoreName) || string.IsNullOrEmpty(request.Address) || request.Latitude == null || request.Longitude == null)
                return BadRequest(new { error = "Vui lòng cung cấp đầy đủ thông tin" });

            try
            {
                var store = new Store
                {
                    StoreName = request.StoreName,
                    Address = request.Address,
                    Latitude = request.Latitude.Value,
                    Longitude = request.Longitude.Value,
                    ImageURL = request.ImageUrl
                };
                _context.Stores.Add(store);
                await _context.SaveChangesAsync();
                return StatusCode(201, store);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] StoreRequest request)
        {
            if (string.IsNullOrEmpty(request.StoreName) || string.IsNullOrEmpty(request.Address) || request.Latitude == null || request.Longitude == null)
                return BadRequest(new { error = "Vui lòng cung cấp đầy đủ thông tin" });

            try
            {
                var store = await _context.Stores.FindAsync(id);
                if (store == null)
                    return NotFound(new { error = "Không tìm thấy cửa hàng" });

                store.StoreName = request.StoreName;
                store.Address = request.Address;
                store.Latitude = request.Latitude.Value;
                store.Longitude = request.Longitude.Value;
                store.ImageURL = request.ImageUrl;
                await _context.SaveChangesAsync();
                return Ok(store);
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
                var store = await _context.Stores.FindAsync(id);
                if (store == null)
                    return NotFound(new { error = "Không tìm thấy cửa hàng" });

                _context.Stores.Remove(store);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Xóa cửa hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Lỗi máy chủ nội bộ", details = ex.Message });
            }
        }
    }

    public class StoreRequest
    {
        public string StoreName { get; set; }
        public string Address { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? ImageUrl { get; set; }
    }
}
