const DEFAULT_API_BASE = window.location.origin;

function getApiBase() {
  return (window.VRTECH_API_BASE || DEFAULT_API_BASE).replace(/\/$/, "");
}

function normalizeVietnamesePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function isValidVietnamesePhone(value) {
  return /^0\d{9}$/.test(normalizeVietnamesePhone(value));
}

function normalizeWarrantySerial(value) {
  return String(value || "").trim().toUpperCase();
}

function isValidWarrantySerial(value) {
  const serial = normalizeWarrantySerial(value);
  return !serial || /^VRTECH-[A-Z0-9]+-\d{6}$/.test(serial);
}

function showPhoneError(status, input) {
  if (status) {
    status.textContent = "Số điện thoại phải đủ đúng 10 chữ số, ví dụ 0866 955 966.";
  }
  if (input instanceof HTMLElement) {
    input.focus();
  }
}

function initializeContactForms() {
  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    if (form.dataset.bound === "true") {
      return;
    }

    form.dataset.bound = "true";
    const status = form.querySelector("[data-contact-status]");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      const payload = Object.fromEntries(new FormData(form).entries());
      const phoneInput = form.querySelector('input[name="phone"]');

      if (!isValidVietnamesePhone(payload.phone)) {
        showPhoneError(status, phoneInput);
        return;
      }
      payload.phone = normalizeVietnamesePhone(payload.phone);

      if (status) {
        status.textContent = "Đang gửi thông tin...";
      }
      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const response = await fetch(`${getApiBase()}/api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        form.reset();
        if (status) {
          status.textContent = "Đã gửi thông tin. VRTECH sẽ liên hệ lại sớm.";
        }
      } catch {
        if (status) {
          status.textContent = "Chưa gửi được. Vui lòng gọi hotline hoặc thử lại sau.";
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  });
}

function renderWarrantyResult(container, data) {
  const customer = data.customer || {};
  const product = data.product || {};
  const remaining = data.remaining_days === null ? "" : `${data.remaining_days} ngày`;

  container.hidden = false;
  container.innerHTML = `
    <span class="warranty-result-status">${data.status_label || data.status || "Đã kích hoạt"}</span>
    <h3>${product.name || "Thiết bị VRTECH"}</h3>
    <div class="warranty-result-grid">
      <div class="warranty-result-item"><span>Serial</span><strong>${data.serial_number || "-"}</strong></div>
      <div class="warranty-result-item"><span>Khách hàng</span><strong>${customer.name || "-"}${customer.phone ? ` - ${customer.phone}` : ""}</strong></div>
      <div class="warranty-result-item"><span>Dòng xe</span><strong>${customer.car_model || "-"}</strong></div>
      <div class="warranty-result-item"><span>Ngày kích hoạt</span><strong>${data.activated_at || "-"}</strong></div>
      <div class="warranty-result-item"><span>Ngày hết hạn</span><strong>${data.expired_at || "-"}</strong></div>
      <div class="warranty-result-item"><span>Thời gian còn lại</span><strong>${remaining || "-"}</strong></div>
    </div>
  `;
}

function initializeWarrantyForms() {
  document.querySelectorAll("[data-warranty-form]").forEach((form) => {
    if (form.dataset.bound === "true") {
      return;
    }

    form.dataset.bound = "true";
    const status = form.querySelector("[data-warranty-status]");
    const result = form.querySelector("[data-warranty-result]");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      const payload = Object.fromEntries(new FormData(form).entries());

      Object.keys(payload).forEach((key) => {
        if (!payload[key]) {
          delete payload[key];
        }
      });

      if (!payload.phone && !payload.serial_number) {
        if (status) {
          status.textContent = "Vui lòng nhập số điện thoại hoặc serial thiết bị.";
        }
        return;
      }
      if (payload.phone && !isValidVietnamesePhone(payload.phone)) {
        showPhoneError(status, form.querySelector('input[name="phone"]'));
        return;
      }
      if (payload.phone) {
        payload.phone = normalizeVietnamesePhone(payload.phone);
      }
      if (payload.serial_number) {
        payload.serial_number = normalizeWarrantySerial(payload.serial_number);
        if (!isValidWarrantySerial(payload.serial_number)) {
          if (status) {
            status.textContent = "Serial phải đúng định dạng VRTECH-MODEL-000001 với 6 chữ số cuối.";
          }
          form.querySelector('input[name="serial_number"]')?.focus();
          return;
        }
      }

      if (status) {
        status.textContent = "Đang tra cứu bảo hành...";
      }
      if (result) {
        result.hidden = true;
        result.innerHTML = "";
      }
      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const response = await fetch(`${getApiBase()}/api/warranty/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        const json = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(json.message || "Không tìm thấy thông tin bảo hành.");
        }

        if (status) {
          status.textContent = json.message || "Đã tìm thấy thông tin bảo hành.";
        }
        if (result && json.data) {
          renderWarrantyResult(result, json.data);
        }
      } catch (error) {
        if (status) {
          status.textContent = error.message || "Không tìm thấy thông tin bảo hành. Vui lòng kiểm tra lại.";
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initializeContactForms);
document.addEventListener("componentsLoaded", initializeContactForms);
document.addEventListener("DOMContentLoaded", initializeWarrantyForms);
document.addEventListener("componentsLoaded", initializeWarrantyForms);
