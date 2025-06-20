const app = document.getElementById('app');

// Tạo form bằng JS với Bootstrap
app.innerHTML = `
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h2 class="mb-0 text-center">Gửi Email Marketing</h2>
          </div>
          <div class="card-body">
            <form id="emailForm" enctype="multipart/form-data">
              <div class="mb-3">
                <label class="form-label">Tiêu đề email:</label>
                <input type="text" name="subject" class="form-control" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Nội dung email:</label>
                <textarea id="editor" name="message" class="form-control" required></textarea>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Ảnh đính kèm:</label>
                <input type="file" name="images" class="form-control" accept="image/*" multiple id="imageInput">
                <div id="file-chosen-text" class="form-text">Không có tệp nào được chọn</div>
                <div class="form-text">Có thể chọn nhiều file ảnh (jpg, png, ...)</div>
                <div id="previewImages" class="d-flex flex-wrap gap-2 mt-2"></div>
              </div>

              <div class="mb-3">
                <label class="form-label">File Excel danh sách email:</label>
                <input type="file" name="excel" class="form-control" accept=".xlsx" required>
                <div class="form-text">Chỉ chấp nhận file .xlsx</div>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">
                  <i class="fas fa-paper-plane me-2"></i>Gửi email
                </button>
              </div>
              
              <div id="result" class="mt-3"></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// Thêm tính năng xem trước ảnh đã chọn (cộng dồn)
const imageInput = document.getElementById('imageInput');
const previewImages = document.getElementById('previewImages');
let selectedImages = [];

if (imageInput && previewImages) {
  imageInput.addEventListener('change', function () {
    // Thêm các file mới vào mảng selectedImages (tránh trùng lặp)
    const newFiles = Array.from(imageInput.files);
    newFiles.forEach(file => {
      // Kiểm tra file đã tồn tại trong selectedImages chưa (dựa vào tên và size)
      if (!selectedImages.some(f => f.name === file.name && f.size === file.size)) {
        selectedImages.push(file);
      }
    });
    renderPreviewImages();
    // Reset input để có thể chọn lại cùng 1 file nếu muốn
    imageInput.value = '';
  });
}

function renderPreviewImages() {
  previewImages.innerHTML = '';
  selectedImages.forEach((file, idx) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'position-relative';
        imgWrapper.style.display = 'inline-block';
        imgWrapper.style.marginRight = '8px';
        imgWrapper.style.marginBottom = '8px';

        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'rounded border';
        img.style.width = '90px';
        img.style.height = '90px';
        img.style.objectFit = 'cover';
        imgWrapper.appendChild(img);

        // Nút xóa ảnh
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-close position-absolute top-0 end-0 translate-middle p-1 bg-white rounded-circle';
        removeBtn.style.zIndex = '2';
        removeBtn.style.left = '75px';
        removeBtn.title = 'Xóa ảnh';
        removeBtn.onclick = function () {
          selectedImages.splice(idx, 1);
          renderPreviewImages();
        };
        imgWrapper.appendChild(removeBtn);

        previewImages.appendChild(imgWrapper);
      };
      reader.readAsDataURL(file);
    }
  });

  // Cập nhật dòng chữ theo số lượng ảnh đã chọn
  const fileChosenText = document.getElementById('file-chosen-text');
  if (fileChosenText) {
    if (selectedImages.length === 0) {
      fileChosenText.textContent = 'Không có tệp nào được chọn';
    } else if (selectedImages.length === 1) {
      fileChosenText.textContent = 'Đã chọn 1 ảnh';
    } else {
      fileChosenText.textContent = `Đã chọn ${selectedImages.length} ảnh`;
    }
  }
}

// Nội dung chữ ký công ty
const companySignature = `
<div style="margin-top:40px;">
  <img src="https://i.imgur.com/R2yuxT4.jpeg" alt="SHIN YI" style="height:60px; margin-bottom:4px;"/>
  <div style="font-weight:bold; color:#22577A; font-size:16px; margin-top:4px;">CÔNG TY CỔ PHẦN VAN SHIN YI</div>
  <div style="color:#222; font-size:14px;">Địa chỉ: Đường số 5, KCN Sông Mây, xã Bắc Sơn, Trảng Bom, Đồng Nai</div>
  <div style="color:#222; font-size:14px;">Hotline: 18009085</div>
</div>
`;

// Khởi tạo TinyMCE
// Nếu chưa có chữ ký thì tự động chèn vào cuối nội dung

tinymce.init({
  selector: '#editor',
  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount nonbreaking',
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
  height: 400,
  menubar: false,
  language: 'vi',
  font_family_formats: 'Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Verdana=verdana,geneva;',
  font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
  content_style: `
    body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }
    p { margin: 0; padding: 0; line-height: 1.2; }
    br { margin: 0; line-height: 1.2; }
    h1, h2, h3, h4, h5, h6 { margin: 0.5em 0; line-height: 1.2; }
  `,
  forced_root_block: false,
  block_formats: 'Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3;Header 4=h4;Header 5=h5;Header 6=h6',
  setup: function (editor) {
    editor.on('init', function () {
      const content = editor.getContent();
      if (!content || !content.includes('CÔNG TY CỔ PHẦN VAN SHIN YI')) {
        editor.setContent((content ? content : '') + companySignature);
      }
    });
    editor.on('change', function () {
      editor.save();
    });
    editor.on('keydown', function (e) {
      if (e.keyCode === 13) {
        const selection = editor.selection;
        const range = selection.getRng();

        // Lưu vị trí con trỏ hiện tại
        const bookmark = selection.getBookmark();

        if (e.shiftKey) {
          // Shift+Enter: Chèn thẻ <p> và đặt con trỏ vào đầu thẻ <p>
          editor.execCommand('mceInsertContent', false, '<p> </p>');
          selection.moveToBookmark(bookmark);
          const newNode = selection.getNode();
          if (newNode.nodeName === 'P') {
            range.setStart(newNode, 0);
            range.setEnd(newNode, 0);
            selection.setRng(range);
          }
        } else {
          // Enter: Chèn thẻ <br> và đặt con trỏ ngay sau
          editor.execCommand('InsertLineBreak', false);
          // Đảm bảo con trỏ không nhảy xuống chữ ký
          selection.moveToBookmark(bookmark);
          const newNode = selection.getNode();
          const nextSibling = newNode.nextSibling;
          if (newNode.nodeName === 'BR' && nextSibling) {
            range.setStartBefore(nextSibling);
            range.setEndBefore(nextSibling);
            selection.setRng(range);
          }
        }

        e.preventDefault();
      }
    });
    // Xử lý áp dụng tiêu đề chỉ cho vùng bôi đen
    editor.on('BeforeExecCommand', function (e) {
      if (e.command === 'mceToggleFormat' && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(e.value)) {
        const format = e.value; // Ví dụ: h1, h2, h3, ...
        const selection = editor.selection;
        const range = selection.getRng();

        if (!selection.isCollapsed()) {
          // Lấy nội dung được bôi đen
          const selectedContent = selection.getContent({ format: 'text' });
          // Tạo thẻ tiêu đề mới
          const wrapper = `<${format}>${selectedContent}</${format}>`;
          // Xóa nội dung được bôi đen và chèn thẻ tiêu đề mới
          editor.execCommand('mceInsertContent', false, wrapper);
          // Đặt lại con trỏ sau khi chèn
          const newNode = selection.getNode();
          if (newNode.nodeName.toLowerCase() === format) {
            range.setStartAfter(newNode);
            range.setEndAfter(newNode);
            selection.setRng(range);
          }
          e.preventDefault();
        }
      }
    });
  }
});

// Cập nhật phần xử lý form submit
const emailForm = document.getElementById('emailForm');
if (emailForm) {
  emailForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const resultDiv = document.getElementById('result');

    // Lấy nội dung từ TinyMCE
    const messageContent = tinymce.get('editor').getContent();
    formData.set('message', messageContent);

    // Append tất cả ảnh đã chọn vào formData
    selectedImages.forEach(file => {
      formData.append('images', file);
    });

    // Disable nút submit và hiển thị loading
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang gửi...';
    resultDiv.innerHTML = '';

    try {
      const res = await fetch('/send-emails', {
        method: 'POST',
        body: formData
      });

      const text = await res.text();
      // Kiểm tra nếu là thành công thì hiển thị đẹp hơn
      if (text.includes('Gửi thành công')) {
        showSuccessToast(text);
        // Hiện overlay loading trước khi reload
        const overlay = document.getElementById('loading-overlay');
        setTimeout(() => {
          if (overlay) overlay.style.display = 'flex';
          setTimeout(() => window.location.reload(), 700); // Hiện loading 0.7s rồi reload
        }, 1300); // Toast hiện 1.3s rồi mới show loading
        return;
      } else {
        resultDiv.innerHTML = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i>${text}
                    </div>`;
      }
    } catch (err) {
      resultDiv.innerHTML = `
                <div class="alert alert-danger d-flex flex-column align-items-center justify-content-center py-4">
                    <div class="mb-2">
                        <i class="fas fa-exclamation-circle" style="font-size:2.5rem;"></i>
                    </div>
                    <div class="fw-bold text-center mb-2" style="font-size:1.3rem;">Lỗi gửi email</div>
                    <button class="btn btn-outline-primary mt-2" onclick="window.location.reload()">
                        <i class="fas fa-arrow-left me-2"></i>Thử lại
                    </button>
                </div>`;
    } finally {
      // Reset nút submit
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Gửi email';
    }
  });
}

// Thêm hàm showSuccessToast
function showSuccessToast(message) {
  // Xóa toast cũ nếu có
  const toastContainer = document.getElementById('toast-container');
  toastContainer.innerHTML = '';
  // Tạo toast mới
  const toast = document.createElement('div');
  toast.className = 'toast align-items-center text-bg-success border-0 show shadow-lg';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  toast.style.minWidth = '250px';
  toast.style.borderRadius = '14px';
  toast.style.fontSize = '14px';
  toast.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="toast-body fw-bold d-flex align-items-center">
                <i class="fas fa-check-circle me-3" style="font-size:20px;"></i>
                <span style="font-size: 8px;">${message}</span>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
  toastContainer.appendChild(toast);
  // Hiển thị toast bằng Bootstrap JS
  if (window.bootstrap) {
    const bsToast = new window.bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();
  }
}

// Ẩn overlay loading khi trang load xong
window.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'none';
});