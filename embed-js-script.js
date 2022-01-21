/**
 * Author: Sango Technologies
 * Updated at: 2021-12-07
 */

// OK: https://oz.urr.jp/o_bog_tk_013
// OK: https://oz.urr.jp/o_bosp_tk_001?waad=z5nWfElO
// OK: https://oz.urr.jp/o_bog_tk_010?waad=SLT0TxEz
// SKIP: https://oz.urr.jp/ad_cb_037
// OK: https://cp.charlene.jp/raol_teiki_001_liquid?ad=25200005&argument=z6gwA8vO&dmai=ch_raol_000_280
// OK: https://cp.charlene.jp/sgp_teiki_001_up_b?ad=25200025&argument=z6gwA8vO&dmai=ch_sgp_000_043

const targetClickEl = $("a[href='#l']");
const orgForm = $("#form-order");

const chatBoxForm = {
  hideOriginalForm: function () {
    if (!orgForm) {
      return;
    }

    orgForm.css("height", 0);
    orgForm.css("overflow", "hidden");
  },

  autoSelectAggreementCheckbox: function () {
    const aggreementEl = document.querySelector("#OrderAgreement");
    if (!aggreementEl.checked) {
      document.querySelector("#OrderAgreement").click();
    }
  },

  cloneButtonSubmit: function () {
    setTimeout(() => {
      const orgBtn = document.getElementById("confirm_button_wrapper");
      const cbBtnSubmit = document.getElementById("_confirm_button_wrapper");
      if (orgBtn && cbBtnSubmit) {
        cbBtnSubmit.innerHTML = orgBtn.innerHTML;
      }
    }, 100);
  },

  cloneSumaryValidateMessagge: function () {
    const efoRequiredBoxEl = $("#efo_required_box");
    const cbRequiredBoxEl = $("#_efo_required_box");
    if (!efoRequiredBoxEl || !cbRequiredBoxEl) {
      return;
    }

    cbRequiredBoxEl.html(efoRequiredBoxEl.html());
  },

  initTargetButtonClick: function () {
    if (targetClickEl && targetClickEl.length) {
      targetClickEl.click((evt) => {
        evt.stopPropagation();
        $("#_form-order").css("bottom", "15px");
        return false;
      });
    }
  },

  // Make listen input
  makeListenForInput: function (type) {
    allInputsEl = document.getElementsByTagName(type);
    for (const el of allInputsEl) {
      el.addEventListener("change", (evt) => {
        if (evt.target.type === "radio") {
          const otherRadioEl = document.getElementById(
            evt.target.id.replace("_", "")
          );
          if (otherRadioEl) {
            otherRadioEl.click();
          }

          chatBoxForm.cloneButtonSubmit();
          chatBoxForm.cloneSumaryValidateMessagge();
          return;
        }

        const allInputsSameName = document.getElementsByName(evt.target.name);
        for (const formInput of allInputsSameName) {
          formInput.value = evt.target.value;
          // formInput.focus({ preventScroll: true });
          if (ureru_efo) {
            ureru_efo.initializeValidation();
          }

          chatBoxForm.cloneButtonSubmit();
          chatBoxForm.cloneSumaryValidateMessagge();
        }
      });
    }
  },

  /**
   * Each of page have a diffence submit action
   */
  fixActionForm: function () {
    $("#_form-order").attr("action", orgForm.attr("action"));
  },

  /**
   * Each of page have a diffence submit action
   */
  setDefaultPaymentMethod: function () {
    // Set credit select to convenience
    const options = $("#form-payment-method").find("option");
    if (!options) {
      return;
    }
    const nOption = options.length;
    for (let i = 0; i <= nOption; i++) {
      const option = options[i];
      if (!option || !option.text) {
        continue;
      }

      const label = option.text;
      if (option.value && label.indexOf("コンビニ") >= 0) {
        $("#form-payment-method").val(option.value);
      }
    }

    // document.querySelector("#form-payment-method").value = 'convenience'
  },

  /**
   * Some field can be changed on each URL
   * So need to clone from original form to chatbox form
   */
  hideUselessField: function () {
    // OrderExtra1 field
    const cbExtraFields = $(".cb-form-order").find("select, textarea, input");
    if (!cbExtraFields.length) {
      return;
    }
    const nInput = cbExtraFields.length;
    for (let i = 0; i < nInput; i++) {
      const fieldEl = cbExtraFields[i];
      const hasFieldOnOrg = $("#form-order").find(
        '*[name="' + fieldEl.name + '"]'
      ).length;
      if (!hasFieldOnOrg) {
        $(fieldEl).closest(".cb-form-order__form-item").hide();
      }
    }
  },

  /**
   * Trigger submit parent form
   */
  attachSubmitEvent: function () {
    $("#_form-order").submit(function (event) {
      event.preventDefault();
      orgForm.submit();
      return false;
    });
  },

  /**
   * If original form don't have some field on each of page then hide it
   */
  moveChangeableField: function () {
    // OrderExtra1 field
    const orgExtraEl = $("#form-order").find("#OrderExtra1");
    const cbExtraEl = $(".cb-form-order").find("#_OrderExtra1");
    if (orgExtraEl && orgExtraEl) {
      cbExtraEl.html(orgExtraEl.html());
    }

    // Payment method field
    const orgPaymentMethod = $("#form-order").find("#form-payment-method");
    const cbPaymentMethod = $(".cb-form-order").find("#_form-payment-method");
    if (orgPaymentMethod && cbPaymentMethod) {
      cbPaymentMethod.html(orgPaymentMethod.html());
    }
  },

  closeCBFormOrder: function () {
    $("#_form-order").css("bottom", "-90vh");
  },
};

setTimeout(() => {
  chatBoxForm.fixActionForm();
  chatBoxForm.autoSelectAggreementCheckbox();
  chatBoxForm.moveChangeableField();
  chatBoxForm.cloneSumaryValidateMessagge();
  chatBoxForm.hideUselessField();
  chatBoxForm.setDefaultPaymentMethod();
  chatBoxForm.hideOriginalForm();
  chatBoxForm.initTargetButtonClick();

  chatBoxForm.makeListenForInput("input");
  chatBoxForm.makeListenForInput("select");
  chatBoxForm.makeListenForInput("textarea");
  chatBoxForm.attachSubmitEvent();
}, 1000);

// Add style to head
const head = document.getElementsByTagName("head")[0];
const style = document.createElement("style");
style.appendChild(
  document.createTextNode(`
        .cb-form-order__input-half {
            width: 182px;
        }
        .cb-form-order input[type="text"],
        .cb-form-order input[type="number"],
        .cb-form-order select {
            box-shadow: 1px ​1px 1px rgba(154, 148, 134, 0.3) inset;
            background: #fff;
            display: block;
            border: 1px solid #a4823b;
            padding: 10px;
            height: 36px;
            border-radius: 4px;
            box-sizing: border-box;
            font-weight: 500;
            font-size: 13px;
        }

        .cb-form-order select {
            appearance: none;
            padding-right: 30px;
        }

        .cb-form-order .select-wrapper {
            position: relative;
            display: inline-block;
        }
        .cb-form-order .select-wrapper::after {
            content: "▼";
            font-size: 12px;
            top: 9px;
            right: 10px;
            position: absolute;
        }

        .cb-form-order #_confirm_button_wrapper {
            position: relative;
        }

        .cb-form-order input[type="image"] {
            margin: 0 auto;
        }

        .cb-form-order #_confirm_button_wrapper * {
            max-width: 100%;
        }

        .cb-form-order {
            overflow-x: hidden;
            z-index: 10000;
            max-width: 500px;
            width: 405px;
            height: 80vh;
            line-height: 16px;
            overflow: auto;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 40px;
            border-radius: 8px;
            background-color: #fff;
            position: fixed;
            bottom: -90vh;
            right: 10px;
            transition: 0.3s;
            font-size: 14px;
            margin: auto !important;
            background: #f4f7f8;
        }

        .cb-form-order.cb-form-order--active {
            bottom: 10px;
            /* display: block; */
        }

        .cb-form-order__form-desc,
        .cb-form-order #_efo_required_box {
            padding: 10px 15px;
            background: #f7f3e8;
            text-align: center;
        }

        .cb-form-order__form-item {
            padding: 10px 15px;
        }

        .cb-form-order__label {
            margin-bottom: 10px;
        }

        .cb-form-order__label strong {
            padding: 5px 10px 5px 20px;
            background: #e4e4e3;
            border-radius: 4px;
            font-weight: 600;
            margin-left: -20px;
        }

        .cb-form-order__form-item .fix-label-width {
            width: 50px;
            text-align: right;
        }

        .cb-form-order__heading {
            position: sticky;
            z-index: 1000;
            top: 0;
            box-shadow: 0 2px 10px rgb(0 0 0 / 20%);
            padding: 15px 0;
            text-align: center;
            background: linear-gradient(135deg, #997b39 0%, #a2823b 100%);
            background-position: center;
            color: #fff;
        }

        .cb-form-order__heading h2 {
            font-size: 18px;
            line-height: 20px;
            margin: 0;
        }

        .cb-form-order__heading-payment {
            background: url(https://dj3miiry203h.cloudfront.net/Advanceds/689/form_title03.jpg) no-repeat top left;
            text-indent: -9999px;
            margin: 0;
        }

        .cb-form-order__checkout-message {
            margin: 10px 0;
        }

        .cb-form-order__agreement {
            background-color: #f2f2f2;
            padding: 10px;
        }

        .text-red {
            color: red;
        }

        .text-gray {
            color: #999;
            font-size: 12px;
        }

        .flex {
            display: flex;
        }

        .gap-4 {
            display: inline-flex;
            gap: 12px;
        }

        .mt-1 {
            margin-top: 5px;
        }

        .items-center {
            align-items: center;
        }

        .w-full {
            width: 100%;
        }

        .btn-arrow {
            position: absolute;
            cursor: pointer;
            right: 4%;
            top: 36%;
        }

        div#confirm_button_disable {
            background: #f4f7f8;
        }
    `)
);
head.appendChild(style);

const chatboxEl = document.createElement("div");
chatboxEl.innerHTML = `
        <form method="post" accept-charset="utf-8" class="cb-form-order" id="_form-order" novalidate="novalidate" action="/o_bog_tk_013#l">
            <div style="display:none;">
                <input type="hidden" name="_method" value="POST" />
            </div>
            <div class="cb-form-order__heading">
                <div class='btn-arrow' onclick="chatBoxForm.closeCBFormOrder()">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ5MC42ODggNDkwLjY4OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IiIgZD0iTTQ3Mi4zMjgsMTIwLjUyOUwyNDUuMjEzLDM0Ny42NjVMMTguMDk4LDEyMC41MjljLTQuMjM3LTQuMDkzLTEwLjk5LTMuOTc1LTE1LjA4MywwLjI2MiAgYy0zLjk5Miw0LjEzNC0zLjk5MiwxMC42ODcsMCwxNC44MmwyMzQuNjY3LDIzNC42NjdjNC4xNjUsNC4xNjQsMTAuOTE3LDQuMTY0LDE1LjA4MywwbDIzNC42NjctMjM0LjY2NyAgYzQuMjM3LTQuMDkzLDQuMzU0LTEwLjg0NSwwLjI2Mi0xNS4wODNjLTQuMDkzLTQuMjM3LTEwLjg0NS00LjM1NC0xNS4wODMtMC4yNjJjLTAuMDg5LDAuMDg2LTAuMTc2LDAuMTczLTAuMjYyLDAuMjYyICBMNDcyLjMyOCwxMjAuNTI5eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iI2ZmYzEwNyIgY2xhc3M9IiI+PC9wYXRoPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Ik0yNDUuMjEzLDM3My40MTVjLTIuODMxLDAuMDA1LTUuNTQ4LTEuMTE1LTcuNTUyLTMuMTE1TDIuOTk0LDEzNS42MzNjLTQuMDkzLTQuMjM3LTMuOTc1LTEwLjk5LDAuMjYyLTE1LjA4MyAgYzQuMTM0LTMuOTkyLDEwLjY4Ny0zLjk5MiwxNC44MiwwbDIyNy4xMzYsMjI3LjExNWwyMjcuMTE1LTIyNy4xMzZjNC4wOTMtNC4yMzcsMTAuODQ1LTQuMzU0LDE1LjA4My0wLjI2MiAgYzQuMjM3LDQuMDkzLDQuMzU0LDEwLjg0NSwwLjI2MiwxNS4wODNjLTAuMDg2LDAuMDg5LTAuMTczLDAuMTc2LTAuMjYyLDAuMjYyTDI1Mi43NDQsMzcwLjI3OSAgQzI1MC43NDgsMzcyLjI4MSwyNDguMDM5LDM3My40MDgsMjQ1LjIxMywzNzMuNDE1eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+"
                        style="width: 18px;" />
                </div>
                <h2>お客様情報</h2>
            </div>

            <p class="cb-form-order__form-desc">
                お客様のご住所・ご連絡先や、お支払い方法等を入力してください。
            </p>

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>お名前 <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center">
                    <div>
                        <span>姓</span>
                        <input type="text" name="family_name" class="cb-form-order__input cb-form-order__input-half" />
                    </div>
                    <div>
                        <span>名</span>
                        <input type="text" name="given_name" class="cb-form-order__input cb-form-order__input-half" />
                    </div>
                </div>
            </div>

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>ふりがな <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center">
                    <div>
                        <span>せい</span>
                        <input type="text" name="family_kana" class="cb-form-order__input cb-form-order__input-half" />
                    </div>
                    <div>
                        <span>めい</span>
                        <input type="text" name="given_kana" class="cb-form-order__input cb-form-order__input-half" />
                    </div>
                </div>
            </div>

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>郵便番号 <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center">
                    <strong>〒</strong>
                    <div>
                        <input type="text" name="zip1" class="cb-form-order__input" style="width: 50px" />
                    </div>
                    <strong>-</strong>
                    <div>
                        <input type="text" name="zip2" class="cb-form-order__input" style="width: 80px" />
                    </div>
                    <span class="text-gray">
                        例）012-3456
                    </span>
                </div>
                <div class="text-red flex gap-4 mt-1">
                    ※自宅住所をご登録ください。
                </div>
            </div>

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>都道府県 <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex select-wrapper">
                    <select name="prefecture" autocomplete="nope">
                        <option value="">選択してください</option>
                        <option value="1">北海道</option>
                        <option value="2">青森県</option>
                        <option value="3">岩手県</option>
                        <option value="4">宮城県</option>
                        <option value="5">秋田県</option>
                        <option value="6">山形県</option>
                        <option value="7">福島県</option>
                        <option value="8">茨城県</option>
                        <option value="9">栃木県</option>
                        <option value="10">群馬県</option>
                        <option value="11">埼玉県</option>
                        <option value="12">千葉県</option>
                        <option value="13">東京都</option>
                        <option value="14">神奈川県</option>
                        <option value="15">新潟県</option>
                        <option value="16">富山県</option>
                        <option value="17">石川県</option>
                        <option value="18">福井県</option>
                        <option value="19">山梨県</option>
                        <option value="20">長野県</option>
                        <option value="21">岐阜県</option>
                        <option value="22">静岡県</option>
                        <option value="23">愛知県</option>
                        <option value="24">三重県</option>
                        <option value="25">滋賀県</option>
                        <option value="26">京都府</option>
                        <option value="27">大阪府</option>
                        <option value="28">兵庫県</option>
                        <option value="29">奈良県</option>
                        <option value="30">和歌山県</option>
                        <option value="31">鳥取県</option>
                        <option value="32">島根県</option>
                        <option value="33">岡山県</option>
                        <option value="34">広島県</option>
                        <option value="35">山口県</option>
                        <option value="36">徳島県</option>
                        <option value="37">香川県</option>
                        <option value="38">愛媛県</option>
                        <option value="39">高知県</option>
                        <option value="40">福岡県</option>
                        <option value="41">佐賀県</option>
                        <option value="42">長崎県</option>
                        <option value="43">熊本県</option>
                        <option value="44">大分県</option>
                        <option value="45">宮崎県</option>
                        <option value="46">鹿児島県</option>
                        <option value="47">沖縄県</option>
                    </select>
                </div>
            </div>

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>住所1（市郡区/町・村・丁目） <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center w-full">
                    <div>
                        <input type="text" name="address1" class="cb-form-order__input" />
                    </div>
                    <span class="text-gray">
                        例）○○市△△区□町
                    </span>
                </div>
                <div class="text-red flex gap-4 mt-1">
                    ※自宅住所をご登録ください。
                </div>
            </div>

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>住所2（番地） <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center w-full">
                    <div>
                        <input type="text" name="address2" class="cb-form-order__input" />
                    </div>
                    <span class="text-gray">
                        例）1-1
                    </span>
                </div>
                <div class="text-red flex gap-4 mt-1">
                    ※自宅住所をご登録ください。
                </div>
            </div>

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>住所3（マンション名・号室）</strong>
                </div>
                <div class="flex gap-4 items-center w-full">
                    <div>
                        <input type="text" name="address3" class="cb-form-order__input" />
                    </div>
                    <span class="text-gray">
                        例）○○マンション101号
                    </span>
                </div>
                <div class="text-red flex gap-4 mt-1">
                    ※自宅住所をご登録ください。
                </div>
            </div>

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>電話番号 <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center">
                    <strong>〒</strong>
                    <div>
                        <input type="text" name="tel_no1" class="cb-form-order__input" style="width: 50px" />
                    </div>
                    <strong>-</strong>
                    <div>
                        <input type="text" name="tel_no2" class="cb-form-order__input" style="width: 50px" />
                    </div>
                    <strong>-</strong>
                    <div>
                        <input type="text" name="tel_no3" class="cb-form-order__input" style="width: 50px" />
                    </div>
                    <span class="text-gray">
                        （半角数字）
                    </span>
                </div>
                <div class="text-red flex gap-4 mt-1">
                    ※自宅住所をご登録ください。
                </div>
            </div>

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>メールアドレス <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center">
                    <div>
                        <input type="text" name="email" class="cb-form-order__input" />
                    </div>
                </div>
                <div class="text-gray flex gap-4 mt-1">
                    メールの振り分け設定やドメイン設定をされている場合は設定の解除をお願いします。＜ドメイン＞ @urr.jp
                </div>
            </div>

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>メールアドレス（確認） <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center">
                    <div>
                        <input type="text" name="email_confirm" class="cb-form-order__input" />
                    </div>
                </div>
                <div class="text-gray flex gap-4 mt-1">
                    メールの振り分け設定やドメイン設定をされている場合は設定の解除をお願いします。＜ドメイン＞ @urr.jp
                </div>
            </div>
            <!-- Not yet -->
            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>性別 <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center nowrap">
                    <input type="hidden" name="sex" value="" />
                    <input type="radio" name="sex" value="2" id="_OrderSex2">
                    <label for="_OrderSex2">女性</label>
                    <input type="radio" name="sex" value="1" id="_OrderSex1">
                    <label for="_OrderSex1">男性</label>
                </div>

            </div>
            <!-- not yet -->

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>生年月日 <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center">
                    <div>
                        <input type="number" name="birthday[year]" class="cb-form-order__input" style="width: 100px" />
                    </div>
                    <strong>年</strong>
                    <div class="select-wrapper">
                        <select name="birthday[month]" id="_OrderBirthdayMonth">
                            <option value="">--</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </div>
                    <strong>月</strong>
                    <div class="select-wrapper">
                        <select name="birthday[day]" id="_OrderBirthdayDay">
                            <option value="">--</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                            <option value="31">31</option>
                        </select>
                    </div>
                    <strong>日</strong>
                </div>
                <div class="text-gray">
                    （半角数字）
                </div>
            </div>

            <div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>商品選択 <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center">
                    <div class="select-wrapper">
                        <select name="extra1" id="_OrderExtra1">
                            <option value=""></option>
                            <option value="ジャータイプ">ジャータイプ</option>
                            <option value="チューブタイプ">チューブタイプ</option>
                        </select>
                    </div>
                    <span class="text-gray">
                        2タイプをご用意しています。
                    </span>
                </div>
            </div>

            <!-- USELESS -->
            <!-- div class="cb-form-order__form-item">
                <div class="cb-form-order__label">
                    <strong>お支払い方法 <span class="text-red">(必須)</span></strong>
                </div>
                <div class="flex gap-4 items-center">
                    <div class="select-wrapper">
                        <select name="payment_method" value="np_wiz" id="_form-payment-method">
                            <option value="np_wiz">後払い（コンビニ・郵便局・銀行）</option>
                            <option value="collect">代金引換</option>
                            <option value="amazon_payments">Amazon Pay</option>
                            <option value="credit">クレジットカード</option></select>
                        </select>
                    </div>
                </div>
            </div -->

            <div class="cb-form-order__form-item" style="display: none">
                <input type="checkbox" checked="true" name="agreement" value="1" class="ureru_efo_agreement form-error" id="OrderAgreement">
            </div>

            <div id="_efo_required_box"></div>

            <div id="_confirm_button_wrapper">
                <div id="_confirm_button">
                    <div id="_flash_confirm">
                        <input type="image" id="_impt" src="https://dj3miiry203h.cloudfront.net/Advanceds/689/p2_btn_conf.jpg" alt="お申し込み内容確認" class="w-full" />
                    </div>
                </div>
            </div>
            <!-- フォーム終了タグ -->
        </form>
    `;
document.body.appendChild(chatboxEl);
