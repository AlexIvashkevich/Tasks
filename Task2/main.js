const parseFromString = (string) => {
  if (!string) return null;
  return string
    .slice(1)
    .split("&")
    .reduce((a, c) => {
      const [key, value] = c.split("=");

      if (a[key]) {
        return {
          ...a,
          [key]: Array.isArray(a[key]) ? [...a[key], value] : [a[key], value],
        };
      }

      return { ...a, [key]: value };
    }, {});
};

const parseToString = (formValues, fileds) => {
  const queryString = Object.entries(formValues)
    .reduce((a, [key, value]) => {
      if (fileds && fileds.includes(key)) {
        return a;
      }

      if (Array.isArray(value)) {
        return `${a}${value.reduce((a, c) => `${a}${key}=${c}&`, "")}`;
      }

      return `${a}${key}=${value}&`;
    }, "?")
    .slice(0, -1);

  console.log(queryString);

  return queryString;
};

class OrderForm {
  constructor() {
    this.form = document.getElementById("order-form");
    this.select = this.form.querySelector("select");
    this.fields = {
      size: Array.from(this.form.querySelectorAll("input[name=size]")),
      color: Array.from(
        this.form.querySelector("#colors").querySelectorAll("input")
      ),
      manufacturer: Array.from(this.select.querySelectorAll("option")),
      sales: this.form.querySelector("input[name=sales]"),
    };
    this.values = {
      color: [],
      size: "",
      manufacturer: [],
      sales: 0,
    };
  }

  updateSize(size) {
    this.fields.size.forEach((field) => {
      field.checked = field.value === size;
    });
  }

  updateColor(color) {
    this.fields.color.forEach((field) => {
      field.checked = color.includes(field.value);
    });
  }

  updateManufacturer(manufacturer) {
    this.fields.manufacturer.forEach((option) => {
      option.selected = manufacturer.includes(option.value);
    });
  }

  initialUpdateFields({ color, size, manufacturer }) {
    if (color) {
      this.updateColor(color);
    }

    if (size) {
      this.updateSize(size);
    }

    if (manufacturer) {
      this.updateManufacturer(manufacturer);
    }
  }

  setInitialFormValues(params) {
    const queryParams = parseFromString(params);

    if (queryParams) {
      const formValues = { ...this.values, ...queryParams };
      this.initialUpdateFields(formValues);

      this.values = formValues;
    }
  }

  listeners() {
    this.fields.size.forEach((field) => {
      field.addEventListener("change", (e) => {
        this.values.size = e.target.value;

        parseToString(this.values, ["sales"]);
      });
    });

    this.fields.color.forEach((field) => {
      field.addEventListener("change", (e) => {
        this.values.color = this.values.color.includes(e.target.value)
          ? this.values.color.filter((color) => color !== e.target.value)
          : [...this.values.color, e.target.value];

        parseToString(this.values, ["sales"]);
      });
    });

    this.select.addEventListener("change", () => {
      this.values.manufacturer = this.fields.manufacturer
        .map((option) => option.selected && option.value)
        .filter(Boolean);

      parseToString(this.values, ["sales"]);
    });

    this.fields.sales.addEventListener("change", (e) => {
      this.values.sales = Number(e.target.checked);
    });
  }

  init() {
    this.setInitialFormValues(window.location.search);
    this.listeners();
  }
}

const orderForm = new OrderForm();
orderForm.init();
