window.onload = () => {
  const input = document.querySelector("#input");
  const link = document.querySelector("#link");
  let timer = null;
  const debounce = (fn) => () => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn();
      timer = null;
    }, 1000);
  };

  const handleChange = () => {
    const url = input.value;
    if (!url) return;
    if (!input.classList.contains("loading")) input.classList.add("loading");
    fetch("/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })
      .then((res) => res.text())
      .then((id) => {
        input.classList.remove("loading");
        const href = `${window.location.origin}/${id}`;
        link.href = link.innerHTML = href;
      });
  };

  input.addEventListener("input", debounce(handleChange));
};
