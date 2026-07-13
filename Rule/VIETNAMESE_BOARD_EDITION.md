# VIETNAMESE DORAEMON BOARD EDITION SPECIFICATION (BỘ CỜ TỶ PHÚ DORAEMON - BẢN MIỀN NAM CHÍNH XÁC 100%)

This document specifies the exact **Vietnamese Doraemon Edition (Bản Miền Nam nguyên mẫu vật lý)** localization and 40-space board data registry for the Monopoly Web Application, transcribed 1:1 from the physical board reference photos.

---

## 1. CLIENT UI LANGUAGE & THEME REQUIREMENTS
- **All Client-Facing UI Text:** Vietnamese (`Tiếng Việt`).
- **Theme & Center Graphic:** Doraemon Vietnamese Cờ Tỷ Phú theme.
- **Direction of Travel:** Starting from `BẮT ĐẦU` at corner Index 0, moving clockwise around the 40 spaces.

---

## 2. EXACT 40-SPACE BOARD REGISTRY INDEX (0 TO 39)

| Index | Vietnamese Name (Exact Printed Label) | Type | Color Group | Purchase Price | Printed Notes / Rent |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **0** | **BẮT ĐẦU** | `CORNER` | - | - | Lãnh lương $200 khi qua ô |
| **1** | **TÂN KỲ TÂN QUÝ** | `PROPERTY` | `BROWN` | $60 | Base Rent $2 |
| **2** | **KHÍ VẬN** | `COMMUNITY_CHEST`| - | - | Rút thẻ Khí Vận |
| **3** | **LŨY BÁN BÍCH** | `PROPERTY` | `BROWN` | $60 | Base Rent $4 |
| **4** | **THUẾ THU NHẬP** | `TAX` | - | Pay $200 | Trả 10% hoặc $200 |
| **5** | **BẾN XE CẦN GIUỘC** | `RAILROAD` | - | $200 | Base Rent $25 |
| **6** | **QUANG TRUNG** | `PROPERTY` | `LIGHT_BLUE` | $100 | Base Rent $6 |
| **7** | **CƠ HỘI** | `CHANCE` | - | - | Rút thẻ Cơ Hội |
| **8** | **NGUYỄN KIỆM** | `PROPERTY` | `LIGHT_BLUE` | $100 | Base Rent $6 |
| **9** | **CỘNG HÒA** | `PROPERTY` | `LIGHT_BLUE` | $120 | Base Rent $8 |
| **10** | **THĂM TÙ / Ở TÙ** | `CORNER` | - | - | Just Visiting / In Jail |
| **11** | **HOÀNG VĂN THỤ** | `PROPERTY` | `PINK` | $140 | Base Rent $10 |
| **12** | **CÔNG TY ĐIỆN LỰC** | `UTILITY` | - | $200 | Roll x4/x10 |
| **13** | **TRƯỜNG CHINH** | `PROPERTY` | `PINK` | $140 | Base Rent $10 |
| **14** | **LÊ ĐẠI HÀNH** | `PROPERTY` | `PINK` | $160 | Base Rent $12 |
| **15** | **BẾN XE MIỀN ĐÔNG** | `RAILROAD` | - | $200 | Base Rent $25 |
| **16** | **NGUYỄN TRI PHƯƠNG** | `PROPERTY` | `ORANGE` | $180 | Base Rent $14 |
| **17** | **KHÍ VẬN** | `COMMUNITY_CHEST`| - | - | Rút thẻ Khí Vận |
| **18** | **KHA VẠN CÂN** | `PROPERTY` | `ORANGE` | $180 | Base Rent $14 |
| **19** | **PHẠM THẾ HIỂN** | `PROPERTY` | `ORANGE` | $200 | Base Rent $16 |
| **20** | **BÃI ĐẬU XE MIỄN PHÍ** | `CORNER` | - | - | Free Parking |
| **21** | **HUỲNH TẤN PHÁT** | `PROPERTY` | `RED` | $220 | Base Rent $18 |
| **22** | **CƠ HỘI** | `CHANCE` | - | - | Rút thẻ Cơ Hội |
| **23** | **HÙNG VƯƠNG** | `PROPERTY` | `RED` | $220 | Base Rent $18 |
| **24** | **HẬU GIANG** | `PROPERTY` | `RED` | $240 | Base Rent $20 |
| **25** | **BẾN XE CHỢ LỚN** | `RAILROAD` | - | $200 | Base Rent $25 |
| **26** | **AN DƯƠNG VƯƠNG** | `PROPERTY` | `YELLOW` | $260 | Base Rent $22 |
| **27** | **NGUYỄN TRÃI** | `PROPERTY` | `YELLOW` | $260 | Base Rent $22 |
| **28** | **CÔNG TY CẤP NƯỚC** | `UTILITY` | - | $200 | Roll x4/x10 |
| **29** | **NGUYỄN TẤT THÀNH** | `PROPERTY` | `YELLOW` | $280 | Base Rent $24 |
| **30** | **VÀO TÙ** | `CORNER` | - | - | Di chuyển đến ô 10 |
| **31** | **HAI BÀ TRƯNG** | `PROPERTY` | `GREEN` | $300 | Base Rent $26 |
| **32** | **VÕ THỊ SÁU** | `PROPERTY` | `GREEN` | $300 | Base Rent $26 |
| **33** | **KHÍ VẬN** | `COMMUNITY_CHEST`| - | - | Rút thẻ Khí Vận |
| **34** | **LƯƠNG ĐỊNH CỦA** | `PROPERTY` | `GREEN` | $320 | Base Rent $28 |
| **35** | **BẾN XE MIỀN TẤY** | `RAILROAD` | - | $200 | Base Rent $25 |
| **36** | **CƠ HỘI** | `CHANCE` | - | - | Rút thẻ Cơ Hội |
| **37** | **LÊ LỢI** | `PROPERTY` | `DARK_BLUE`| $350 | Base Rent $35 |
| **38** | **THUẾ ĐẶC BIỆT** | `TAX` | - | Pay $100 | Trả $100 |
| **39** | **NGUYỄN HUỆ** | `PROPERTY` | `DARK_BLUE`| $400 | Base Rent $50 |

---

## 3. DESIGN FIDELITY NOTES
- **Bến Xe (4 Bus Stations):** `Bến Xe Cần Giuộc`, `Bến Xe Miền Đông`, `Bến Xe Chợ Lớn`, `Bến Xe Miền Tây`.
- **Most Valuable Street Properties (Dark Blue):** `Lê Lợi ($350)` & `Nguyễn Huệ ($400)`.
