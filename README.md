# PDF'den Etkileşimli Flipbook Oluşturucu / Interactive PDF to Flipbook Converter
- Tek bir HTML dosyası ile PDF'lerinizi modern, hızlı ve etkileşimli dijital yayınlara dönüştürün.
- Sunucuya veya karmaşık kütüphanelere gerek yok.
- Türkçe kullanım için flipbook_maker_TR.html sayfasını indirip kulanabilirsiniz.
---
- Convert your PDFs into modern, fast, and interactive digital publications with a single HTML file. 
- No server or complex dependencies needed.
- You can download and use the flipbook_maker_EN.html page for English usage.
---

![Local GIF](flipbook_maker_animation.gif)

## Flipbook Oluşturucu Hakkında / About Flipbook Creator

Bu bağımsız html sayfası, standart PDF dosyalarını, gerçek bir kitap veya dergi gibi sayfa çevirme efektine sahip, akıcı ve modern dijital flipbook'lara dönüştürmek için tasarlanmıştır. Tamamen tarayıcı üzerinde (yerel bilgisayarınızda) çalışır ve sonuç olarak her yerde paylaşılabilen, kendi kendine yeten tek bir `.html` dosyası üretir.

This standalone html page is designed to convert standard PDF files into fluid, modern digital flipbooks with a realistic page-turning effect, just like a real book or magazine. It runs entirely in the browser (locally) and produces a single, self-contained `.html` file that can be shared and viewed anywhere.

## Özellikler / Features

- Sayfa sınırı yok. / No page limit.
- Yerel bilgisayarınızdan çalışır. PDF dosyalarınız güvende. / Works directly on your computer. Your PDF's in secure.
- Oluşturduğunuz flipbook'u html sayfası olarak indirebilirsiniz (farklı kaydedebilirsiniz). Tekrar oluşturmanıza gerek yok. / You can download (save as) the flipbook you created as an HTML page. You don't need to create it again.

## Kullanım Alanları / Use Cases

- Dijital Dergiler ve Kataloglar / Digital Magazines and Catalogs
- Eğitim Materyalleri ve E-Kitaplar / Educational Materials and E-Books
- Ürün Broşürleri ve Kılavuzlar / Product Brochures and Guides
- Restoran Menüleri / Restaurant Menus

## Nasıl Kullanılır? / How to Use

1. `flipbook_maker_TR.html` dosyasını tarayıcınızda açın. / Open the `flipbook_maker_EN.html` file in your browser.
2. "PDF Dosyası Seç" butonuna tıklayarak bilgisayarınızdan bir PDF seçin. / Click the “Select PDF File” button and choose a PDF from your computer.
3. Dosyanın işlenmesini bekleyin ve "Flipbook Oluştur" butonuna tıklayın. / Wait for the file to process and click the “Create Flipbook” button.
4. Flipbook'unuz yeni bir sekmede açılacaktır. / Your flipbook will open in a new tab. 
5. Oluşturduğunuz flipbook'u kaydetmek için alttaki "İndir" butonunu kullanabilirsiniz. / To save the flipbook you created, you can use the “Download” button below.

## NOTLAR / NOTES
---
1. PDF işlemleri için Apache 2.0 altında lisanslı olan [PDF.JS ](https://mozilla.github.io/pdf.js/) kullanılmıştır.
2. Bu sebeple internet bağlantısı gerektirir.
3. HTML etiketlerinde düzenleme yaparak gerekli dosyaları ekelemeniz halinde tamamen internetsiz olarak çalışabilir.
4. Bahsedilen etiketler:
```<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>``` and ```pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js'```

---
1. PDF processings has been making with [PDF.JS](https://mozilla.github.io/pdf.js/), which licensed under Apache 2.0.
2. Therefore, an internet connection is required.
3. By editing the html-tags and adding the necessary files, it can work completely offline.
4. The html-tags mentioned are as follows:
```<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>``` and ```pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js'```