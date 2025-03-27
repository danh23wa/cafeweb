using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TinTuc> TinTuc { get; set; }
    public DbSet<ThanhToan> ThanhToan { get; set; }
    public DbSet<Store> Stores { get; set; }
    public DbSet<SanPham> SanPham { get; set; }
    public DbSet<PhuongThucThanhToan> PhuongThucThanhToan { get; set; }
    public DbSet<NguoiDung> NguoiDung { get; set; }
    public DbSet<LoaiSanPham> LoaiSanPham { get; set; }
    public DbSet<GioHang> GioHang { get; set; }
    public DbSet<DonHang> DonHang { get; set; }
    public DbSet<ChiTietTinTuc> ChiTietTinTuc { get; set; }
    public DbSet<ChiTietHoaDon> ChiTietHoaDon { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
       modelBuilder.Entity<ChiTietTinTuc>().ToTable("ChiTietTinTuc");
        modelBuilder.Entity<ChiTietTinTuc>().HasKey(c => c.Id);
        modelBuilder.Entity<ChiTietTinTuc>()
            .Property(c => c.Id).HasColumnName("id");
        modelBuilder.Entity<ChiTietTinTuc>()
            .Property(c => c.TinTucId).HasColumnName("tin_tuc_id");
        modelBuilder.Entity<ChiTietTinTuc>()
            .Property(c => c.NoiDung).HasColumnName("noi_dung");
        modelBuilder.Entity<ChiTietTinTuc>()
            .Property(c => c.DanhSachSanPham).HasColumnName("danh_sach_san_pham");
        modelBuilder.Entity<ChiTietTinTuc>()
            .Property(c => c.MaKhuyenMai).HasColumnName("ma_khuyen_mai");
        modelBuilder.Entity<ChiTietTinTuc>()
            .Property(c => c.ThoiGianApDung).HasColumnName("thoi_gian_ap_dung");
        modelBuilder.Entity<ChiTietTinTuc>()
            .Property(c => c.LienKet).HasColumnName("lien_ket");
        modelBuilder.Entity<ChiTietTinTuc>()
            .Property(c => c.HinhAnh).HasColumnName("hinh_anh");

        modelBuilder.Entity<ChiTietTinTuc>()
            .HasOne(ct => ct.TinTuc)
            .WithMany(t => t.ChiTietTinTucs)
            .HasForeignKey(ct => ct.TinTucId);

        modelBuilder.Entity<TinTuc>().ToTable("TinTuc");
        modelBuilder.Entity<TinTuc>().HasKey(t => t.Id);
        modelBuilder.Entity<TinTuc>()
            .Property(t => t.Id).HasColumnName("id");
        modelBuilder.Entity<TinTuc>()
            .Property(t => t.TieuDe).HasColumnName("tieu_de");
        modelBuilder.Entity<TinTuc>()
            .Property(t => t.HinhAnh).HasColumnName("hinh_anh");
        modelBuilder.Entity<TinTuc>()
            .Property(t => t.NgayTao).HasColumnName("ngay_tao")
            .HasDefaultValueSql("GETDATE()");
        // ThanhToan
        modelBuilder.Entity<ThanhToan>().ToTable("ThanhToan");
        modelBuilder.Entity<ThanhToan>().HasKey(t => t.MaThanhToan);
        modelBuilder.Entity<ThanhToan>()
            .Property(t => t.MaThanhToan).HasColumnName("MaThanhToan");
        modelBuilder.Entity<ThanhToan>()
            .Property(t => t.MaDonHang).HasColumnName("MaDonHang");
        modelBuilder.Entity<ThanhToan>()
            .Property(t => t.MaPhuongThuc).HasColumnName("MaPhuongThuc");
        modelBuilder.Entity<ThanhToan>()
            .Property(t => t.SoTien).HasColumnName("SoTien").HasPrecision(18, 2);
        modelBuilder.Entity<ThanhToan>()
            .Property(t => t.NgayThanhToan).HasColumnName("NgayThanhToan").HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<ThanhToan>()
            .Property(t => t.TrangThai).HasColumnName("TrangThai");

        // Stores
        modelBuilder.Entity<Store>().ToTable("Stores");
        modelBuilder.Entity<Store>().HasKey(s => s.StoreID);
        modelBuilder.Entity<Store>()
            .Property(s => s.StoreID).HasColumnName("StoreID");
        modelBuilder.Entity<Store>()
            .Property(s => s.StoreName).HasColumnName("StoreName");
        modelBuilder.Entity<Store>()
            .Property(s => s.Address).HasColumnName("Address");
        modelBuilder.Entity<Store>()
            .Property(s => s.ImageURL).HasColumnName("ImageURL");
        modelBuilder.Entity<Store>()
            .Property(s => s.Latitude).HasColumnName("Latitude");
        modelBuilder.Entity<Store>()
            .Property(s => s.Longitude).HasColumnName("Longitude");

        // SanPham
        modelBuilder.Entity<SanPham>().ToTable("SanPham");
        modelBuilder.Entity<SanPham>().HasKey(s => s.MaSanPham);
        modelBuilder.Entity<SanPham>()
            .Property(s => s.MaSanPham).HasColumnName("MaSanPham");
        modelBuilder.Entity<SanPham>()
            .Property(s => s.TenSanPham).HasColumnName("TenSanPham");
        modelBuilder.Entity<SanPham>()
            .Property(s => s.MaLoaiSanPham).HasColumnName("MaLoaiSanPham");
        modelBuilder.Entity<SanPham>()
            .Property(s => s.Gia).HasColumnName("Gia").HasPrecision(18, 2);
        modelBuilder.Entity<SanPham>()
            .Property(s => s.MoTa).HasColumnName("MoTa");
        modelBuilder.Entity<SanPham>()
            .Property(s => s.HinhAnh).HasColumnName("HinhAnh");

        // PhuongThucThanhToan
        modelBuilder.Entity<PhuongThucThanhToan>().ToTable("PhuongThucThanhToan");
        modelBuilder.Entity<PhuongThucThanhToan>().HasKey(p => p.MaPhuongThuc);
        modelBuilder.Entity<PhuongThucThanhToan>()
            .Property(p => p.MaPhuongThuc).HasColumnName("MaPhuongThuc");
        modelBuilder.Entity<PhuongThucThanhToan>()
            .Property(p => p.TenPhuongThuc).HasColumnName("TenPhuongThuc");
        modelBuilder.Entity<PhuongThucThanhToan>()
            .Property(p => p.MoTa).HasColumnName("MoTa");

        // NguoiDung
        modelBuilder.Entity<NguoiDung>().ToTable("NguoiDung");
        modelBuilder.Entity<NguoiDung>().HasKey(n => n.MaNguoiDung);
        modelBuilder.Entity<NguoiDung>()
            .Property(n => n.MaNguoiDung).HasColumnName("MaNguoiDung");
        modelBuilder.Entity<NguoiDung>()
            .Property(n => n.TenNguoiDung).HasColumnName("TenNguoiDung");
        modelBuilder.Entity<NguoiDung>()
            .Property(n => n.SoDienThoai).HasColumnName("SoDienThoai");
        modelBuilder.Entity<NguoiDung>()
            .Property(n => n.Email).HasColumnName("Email");
        modelBuilder.Entity<NguoiDung>()
            .Property(n => n.MatKhau).HasColumnName("MatKhau");
        modelBuilder.Entity<NguoiDung>()
            .Property(n => n.VaiTro).HasColumnName("VaiTro");

        // LoaiSanPham
        modelBuilder.Entity<LoaiSanPham>().ToTable("LoaiSanPham");
        modelBuilder.Entity<LoaiSanPham>().HasKey(l => l.MaLoaiSanPham);
        modelBuilder.Entity<LoaiSanPham>()
            .Property(l => l.MaLoaiSanPham).HasColumnName("MaLoaiSanPham");
        modelBuilder.Entity<LoaiSanPham>()
            .Property(l => l.TenLoaiSanPham).HasColumnName("TenLoaiSanPham");
        modelBuilder.Entity<LoaiSanPham>()
            .Property(l => l.MoTa).HasColumnName("MoTa");

        // GioHang
        modelBuilder.Entity<GioHang>().ToTable("GioHang");
        modelBuilder.Entity<GioHang>().HasKey(g => new { g.MaKhachHang, g.MaSanPham });
        modelBuilder.Entity<GioHang>()
            .Property(g => g.MaKhachHang).HasColumnName("MaKhachHang");
        modelBuilder.Entity<GioHang>()
            .Property(g => g.MaSanPham).HasColumnName("MaSanPham");
        modelBuilder.Entity<GioHang>()
            .Property(g => g.SoLuong).HasColumnName("SoLuong");

        // DonHang
        modelBuilder.Entity<DonHang>().ToTable("DonHang");
        modelBuilder.Entity<DonHang>().HasKey(d => d.MaDonHang);
        modelBuilder.Entity<DonHang>()
            .Property(d => d.MaDonHang).HasColumnName("MaDonHang");
        modelBuilder.Entity<DonHang>()
            .Property(d => d.MaKhachHang).HasColumnName("MaKhachHang");
        modelBuilder.Entity<DonHang>()
            .Property(d => d.NgayDatHang).HasColumnName("NgayDatHang").HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<DonHang>()
            .Property(d => d.TongTien).HasColumnName("TongTien").HasPrecision(18, 2);
        modelBuilder.Entity<DonHang>()
            .Property(d => d.DiaChi).HasColumnName("DiaChi");
        modelBuilder.Entity<DonHang>()
            .Property(d => d.TrangThai).HasColumnName("TrangThai");

        

        // ChiTietHoaDon
        modelBuilder.Entity<ChiTietHoaDon>().ToTable("ChiTietHoaDon");
        modelBuilder.Entity<ChiTietHoaDon>().HasKey(c => c.MaChiTietHoaDon);
        modelBuilder.Entity<ChiTietHoaDon>()
            .Property(c => c.MaChiTietHoaDon).HasColumnName("MaChiTietHoaDon");
        modelBuilder.Entity<ChiTietHoaDon>()
            .Property(c => c.MaDonHang).HasColumnName("MaDonHang");
        modelBuilder.Entity<ChiTietHoaDon>()
            .Property(c => c.MaSanPham).HasColumnName("MaSanPham");
        modelBuilder.Entity<ChiTietHoaDon>()
            .Property(c => c.SoLuong).HasColumnName("SoLuong");
        modelBuilder.Entity<ChiTietHoaDon>()
            .Property(c => c.DonGia).HasColumnName("DonGia").HasPrecision(18, 2);
        modelBuilder.Entity<ChiTietHoaDon>()
            .Property(c => c.ThanhTien).HasColumnName("ThanhTien").HasComputedColumnSql("[SoLuong] * [DonGia]");

        // Quan hệ
        modelBuilder.Entity<SanPham>()
            .HasOne<LoaiSanPham>()
            .WithMany()
            .HasForeignKey(s => s.MaLoaiSanPham);

        modelBuilder.Entity<GioHang>()
            .HasOne<SanPham>()
            .WithMany()
            .HasForeignKey(g => g.MaSanPham);

        modelBuilder.Entity<DonHang>()
            .HasOne<NguoiDung>()
            .WithMany()
            .HasForeignKey(d => d.MaKhachHang);
        modelBuilder.Entity<DonHang>()
            .HasIndex(d => d.MaKhachHang);

        modelBuilder.Entity<ChiTietHoaDon>()
            .HasIndex(c => c.MaDonHang);
        modelBuilder.Entity<GioHang>()
            .HasIndex(g => g.MaKhachHang);

       

        modelBuilder.Entity<ThanhToan>()
            .HasOne<DonHang>()
            .WithMany()
            .HasForeignKey(t => t.MaDonHang);

        modelBuilder.Entity<ThanhToan>()
            .HasOne<PhuongThucThanhToan>()
            .WithMany()
            .HasForeignKey(t => t.MaPhuongThuc);

        modelBuilder.Entity<ChiTietHoaDon>()
            .HasOne<DonHang>()
            .WithMany()
            .HasForeignKey(c => c.MaDonHang);

        modelBuilder.Entity<ChiTietHoaDon>()
            .HasOne<SanPham>()
            .WithMany()
            .HasForeignKey(c => c.MaSanPham);
    }
}

// Các lớp model với ánh xạ JSON

public class ThanhToan
{
    [JsonPropertyName("maThanhToan")]
    public int MaThanhToan { get; set; }

    [JsonPropertyName("maDonHang")]
    public int MaDonHang { get; set; }

    [JsonPropertyName("maPhuongThuc")]
    public int MaPhuongThuc { get; set; }

    [JsonPropertyName("soTien")]
    public decimal SoTien { get; set; }

    [JsonPropertyName("ngayThanhToan")]
    public DateTime NgayThanhToan { get; set; }

    [JsonPropertyName("trangThai")]
    public string TrangThai { get; set; } = string.Empty;
}

public class Store
{
    [JsonPropertyName("storeID")]
    public int StoreID { get; set; }

    [JsonPropertyName("storeName")]
    public string StoreName { get; set; } = string.Empty;

    [JsonPropertyName("address")]
    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("imageURL")]
    public string? ImageURL { get; set; }

    [JsonPropertyName("latitude")]
    public double? Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double? Longitude { get; set; }
}

public class SanPham
{
    [JsonPropertyName("maSanPham")]
    public int MaSanPham { get; set; }

    [JsonPropertyName("tenSanPham")]
    public string TenSanPham { get; set; } = string.Empty;

    [JsonPropertyName("maLoaiSanPham")]
    public int MaLoaiSanPham { get; set; }

    [JsonPropertyName("gia")]
    public decimal Gia { get; set; }

    [JsonPropertyName("moTa")]
    public string MoTa { get; set; } = string.Empty;

    [JsonPropertyName("hinhAnh")]
    public string HinhAnh { get; set; } = string.Empty;
}

public class PhuongThucThanhToan
{
    [JsonPropertyName("maPhuongThuc")]
    public int MaPhuongThuc { get; set; }

    [JsonPropertyName("tenPhuongThuc")]
    public string TenPhuongThuc { get; set; } = string.Empty;

    [JsonPropertyName("moTa")]
    public string? MoTa { get; set; }
}

public class NguoiDung
{
    public int MaNguoiDung { get; set; }
    public string TenNguoiDung { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string Email { get; set; } = string.Empty;
    public string MatKhau { get; set; } = string.Empty;
    public string? VaiTro { get; set; }
}public class LoaiSanPham
{
    [JsonPropertyName("maLoaiSanPham")]
    public int MaLoaiSanPham { get; set; }

    [JsonPropertyName("tenLoaiSanPham")]
    public string TenLoaiSanPham { get; set; } = string.Empty;

    [JsonPropertyName("moTa")]
    public string? MoTa { get; set; }
}

public class GioHang
{
    [JsonPropertyName("maKhachHang")]
    public int MaKhachHang { get; set; }

    [JsonPropertyName("maSanPham")]
    public int MaSanPham { get; set; }

    [JsonPropertyName("soLuong")]
    public int SoLuong { get; set; }
}

public class DonHang
{
    [JsonPropertyName("maDonHang")]
    public int MaDonHang { get; set; }

    [JsonPropertyName("maKhachHang")]
    public int MaKhachHang { get; set; }

    [JsonPropertyName("ngayDatHang")]
    public DateTime NgayDatHang { get; set; }

    [JsonPropertyName("tongTien")]
    public decimal TongTien { get; set; }

    [JsonPropertyName("diaChi")]
    public string DiaChi { get; set; } = string.Empty;

    [JsonPropertyName("trangThai")]
    public string TrangThai { get; set; } = string.Empty;
}

public class ChiTietTinTuc
{
    public int Id { get; set; }
    public int TinTucId { get; set; }
    public string NoiDung { get; set; } = string.Empty;
    public string? DanhSachSanPham { get; set; }
    public string? MaKhuyenMai { get; set; }
    public string? ThoiGianApDung { get; set; }
    public string? LienKet { get; set; }
    public string? HinhAnh { get; set; }
    public TinTuc? TinTuc { get; set; }
}

public class TinTuc
{
    public int Id { get; set; }
    public string TieuDe { get; set; } = string.Empty;
    public string? HinhAnh { get; set; }
    public DateTime NgayTao { get; set; }
    public List<ChiTietTinTuc> ChiTietTinTucs { get; set; } = new();
}
public class ChiTietHoaDon
{
    [JsonPropertyName("maChiTietHoaDon")]
    public int MaChiTietHoaDon { get; set; }

    [JsonPropertyName("maDonHang")]
    public int MaDonHang { get; set; }

    [JsonPropertyName("maSanPham")]
    public int MaSanPham { get; set; }

    [JsonPropertyName("soLuong")]
    public int SoLuong { get; set; }

    [JsonPropertyName("donGia")]
    public decimal DonGia { get; set; }

    [JsonPropertyName("thanhTien")]
    public decimal ThanhTien { get; set; }
}