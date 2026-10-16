//#region src/shared/bounded-buffer.ts
var BoundedBuffer = class {
	constructor(capacity, overflow, measure = () => 1) {
		this.capacity = capacity;
		this.overflow = overflow;
		this.measure = measure;
		this.values = [];
		this.head = 0;
		this.size = 0;
		this.closed = false;
	}
	push(value) {
		if (this.closed) return false;
		const valueSize = this.measure(value);
		if (this.size + valueSize <= this.capacity) {
			this.values.push(value);
			this.size += valueSize;
			return true;
		}
		if (this.overflow.mode !== "drop-oldest") {
			this.closed = true;
			if (this.overflow.mode === "fail-closed") {
				this.drain();
				this.overflow.onOverflow();
			}
			return false;
		}
		this.values.push(value);
		this.size += valueSize;
		while (this.size > this.capacity && this.head < this.values.length - 1) {
			const oldest = this.values[this.head];
			this.size -= this.measure(oldest);
			this.values[this.head] = void 0;
			this.head += 1;
		}
		if (this.size > this.capacity) {
			const fitted = this.overflow.fit?.(value, this.capacity);
			this.values = fitted === void 0 ? [] : [fitted];
			this.head = 0;
			this.size = fitted === void 0 ? 0 : this.measure(fitted);
		} else if (this.head * 2 >= this.values.length) {
			this.values = this.values.slice(this.head);
			this.head = 0;
		}
		return true;
	}
	drain() {
		const values = this.head === 0 ? this.values : this.values.slice(this.head);
		this.values = [];
		this.head = 0;
		this.size = 0;
		return values;
	}
};
//#endregion
export { BoundedBuffer as t };
