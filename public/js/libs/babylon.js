var BABYLON = BABYLON || {};
(function () {
    BABYLON.Ray = function (origin, direction) {
        this.origin = origin;
        this.direction = direction;
    };
    BABYLON.Ray.prototype.intersectsBox = function (box) {
        var d = 0.0;
        var maxValue = Number.MAX_VALUE;
        if (Math.abs(this.direction.x) < 0.0000001) {
            if (this.origin.x < box.minimum.x || this.origin.x > box.maximum.x) {
                return false;
            }
        } else {
            var inv = 1.0 / this.direction.x;
            var min = (box.minimum.x - this.origin.x) * inv;
            var max = (box.maximum.x - this.origin.x) * inv;
            if (min > max) {
                var temp = min;
                min = max;
                max = temp;
            }
            d = Math.max(min, d);
            maxValue = Math.min(max, maxValue);
            if (d > maxValue) {
                return false;
            }
        } if (Math.abs(this.direction.y) < 0.0000001) {
            if (this.origin.y < box.minimum.y || this.origin.y > box.maximum.y) {
                return false;
            }
        } else {
            var inv = 1.0 / this.direction.y;
            var min = (box.minimum.y - this.origin.y) * inv;
            var max = (box.maximum.y - this.origin.y) * inv;
            if (min > max) {
                var temp = min;
                min = max;
                max = temp;
            }
            d = Math.max(min, d);
            maxValue = Math.min(max, maxValue);
            if (d > maxValue) {
                return false;
            }
        } if (Math.abs(this.direction.z) < 0.0000001) {
            if (this.origin.z < box.minimum.z || this.origin.z > box.maximum.z) {
                return false;
            }
        } else {
            var inv = 1.0 / this.direction.z;
            var min = (box.minimum.z - this.origin.z) * inv;
            var max = (box.maximum.z - this.origin.z) * inv;
            if (min > max) {
                var temp = min;
                min = max;
                max = temp;
            }
            d = Math.max(min, d);
            maxValue = Math.min(max, maxValue);
            if (d > maxValue) {
                return false;
            }
        }
        return true;
    };
    BABYLON.Ray.prototype.intersectsSphere = function (sphere) {
        var x = sphere.center.x - this.origin.x;
        var y = sphere.center.y - this.origin.y;
        var z = sphere.center.z - this.origin.z;
        var pyth = (x * x) + (y * y) + (z * z);
        var rr = sphere.radius * sphere.radius;
        if (pyth <= rr) {
            return true;
        }
        var dot = (x * this.direction.x) + (y * this.direction.y) + (z * this.direction.z);
        if (dot < 0.0) {
            return false;
        }
        var temp = pyth - (dot * dot);
        return temp <= rr;
    };
    BABYLON.Ray.prototype.intersectsTriangle = function (vertex0, vertex1, vertex2) {
        if (!this._edge1) {
            this._edge1 = BABYLON.Vector3.Zero();
            this._edge2 = BABYLON.Vector3.Zero();
            this._pvec = BABYLON.Vector3.Zero();
            this._tvec = BABYLON.Vector3.Zero();
            this._qvec = BABYLON.Vector3.Zero();
        }
        vertex1.subtractToRef(vertex0, this._edge1);
        vertex2.subtractToRef(vertex0, this._edge2);
        BABYLON.Vector3.CrossToRef(this.direction, this._edge2, this._pvec);
        var det = BABYLON.Vector3.Dot(this._edge1, this._pvec);
        if (det === 0) {
            return null;
        }
        var invdet = 1 / det;
        this.origin.subtractToRef(vertex0, this._tvec);
        var bu = BABYLON.Vector3.Dot(this._tvec, this._pvec) * invdet;
        if (bu < 0 || bu > 1.0) {
            return null;
        }
        BABYLON.Vector3.CrossToRef(this._tvec, this._edge1, this._qvec);
        var bv = BABYLON.Vector3.Dot(this.direction, this._qvec) * invdet;
        if (bv < 0 || bu + bv > 1.0) {
            return null;
        }
        return {
            bu: bu,
            bv: bv,
            distance: BABYLON.Vector3.Dot(this._edge2, this._qvec) * invdet
        };
    };
    BABYLON.Ray.CreateNew = function (x, y, viewportWidth, viewportHeight, world, view, projection) {
        var start = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 0), viewportWidth, viewportHeight, world, view, projection);
        var end = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 1), viewportWidth, viewportHeight, world, view, projection);
        var direction = end.subtract(start);
        direction.normalize();
        return new BABYLON.Ray(start, direction);
    };
    BABYLON.Ray.Transform = function (ray, matrix) {
        var newOrigin = BABYLON.Vector3.TransformCoordinates(ray.origin, matrix);
        var newDirection = BABYLON.Vector3.TransformNormal(ray.direction, matrix);
        return new BABYLON.Ray(newOrigin, newDirection);
    };
    BABYLON.Color3 = function (initialR, initialG, initialB) {
        this.r = initialR;
        this.g = initialG;
        this.b = initialB;
    };
    BABYLON.Color3.prototype.toString = function () {
        return "{R: " + this.r + " G:" + this.g + " B:" + this.b + "}";
    };
    BABYLON.Color3.prototype.asArray = function () {
        var result = [];
        this.toArray(result, 0);
        return result;
    };
    BABYLON.Color3.prototype.toArray = function (array, index) {
        if (index === undefined) {
            index = 0;
        }
        array[index] = this.r;
        array[index + 1] = this.g;
        array[index + 2] = this.b;
    };
    BABYLON.Color3.prototype.multiply = function (otherColor) {
        return new BABYLON.Color3(this.r * otherColor.r, this.g * otherColor.g, this.b * otherColor.b);
    };
    BABYLON.Color3.prototype.multiplyToRef = function (otherColor, result) {
        result.r = this.r * otherColor.r;
        result.g = this.g * otherColor.g;
        result.b = this.b * otherColor.b;
    };
    BABYLON.Color3.prototype.equals = function (otherColor) {
        return otherColor && this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b;
    };
    BABYLON.Color3.prototype.scale = function (scale) {
        return new BABYLON.Color3(this.r * scale, this.g * scale, this.b * scale);
    };
    BABYLON.Color3.prototype.scaleToRef = function (scale, result) {
        result.r = this.r * scale;
        result.g = this.g * scale;
        result.b = this.b * scale;
    };
    BABYLON.Color3.prototype.clone = function () {
        return new BABYLON.Color3(this.r, this.g, this.b);
    };
    BABYLON.Color3.prototype.copyFrom = function (source) {
        this.r = source.r;
        this.g = source.g;
        this.b = source.b;
    };
    BABYLON.Color3.prototype.copyFromFloats = function (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    };
    BABYLON.Color3.FromArray = function (array) {
        return new BABYLON.Color3(array[0], array[1], array[2]);
    };
    BABYLON.Color3.FromInts = function (r, g, b) {
        return new BABYLON.Color3(r / 255.0, g / 255.0, b / 255.0);
    };
    BABYLON.Color4 = function (initialR, initialG, initialB, initialA) {
        this.r = initialR;
        this.g = initialG;
        this.b = initialB;
        this.a = initialA;
    };
    BABYLON.Color4.prototype.addInPlace = function (right) {
        this.r += right.r;
        this.g += right.g;
        this.b += right.b;
        this.a += right.a;
    };
    BABYLON.Color4.prototype.asArray = function () {
        var result = [];
        this.toArray(result, 0);
        return result;
    };
    BABYLON.Color4.prototype.toArray = function (array, index) {
        if (index === undefined) {
            index = 0;
        }
        array[index] = this.r;
        array[index + 1] = this.g;
        array[index + 2] = this.b;
        array[index + 3] = this.a;
    };
    BABYLON.Color4.prototype.add = function (right) {
        return new BABYLON.Color4(this.r + right.r, this.g + right.g, this.b + right.b, this.a + right.a);
    };
    BABYLON.Color4.prototype.subtract = function (right) {
        return new BABYLON.Color4(this.r - right.r, this.g - right.g, this.b - right.b, this.a - right.a);
    };
    BABYLON.Color4.prototype.subtractToRef = function (right, result) {
        result.r = this.r - right.r;
        result.g = this.g - right.g;
        result.b = this.b - right.b;
        result.a = this.a - right.a;
    };
    BABYLON.Color4.prototype.scale = function (scale) {
        return new BABYLON.Color4(this.r * scale, this.g * scale, this.b * scale, this.a * scale);
    };
    BABYLON.Color4.prototype.scaleToRef = function (scale, result) {
        result.r = this.r * scale;
        result.g = this.g * scale;
        result.b = this.b * scale;
        result.a = this.a * scale;
    };
    BABYLON.Color4.prototype.toString = function () {
        return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
    };
    BABYLON.Color4.prototype.clone = function () {
        return new BABYLON.Color4(this.r, this.g, this.b, this.a);
    };
    BABYLON.Color4.Lerp = function (left, right, amount) {
        var result = new BABYLON.Color4(0, 0, 0, 0);
        BABYLON.Color4.LerpToRef(left, right, amount, result);
        return result;
    };
    BABYLON.Color4.LerpToRef = function (left, right, amount, result) {
        result.r = left.r + (right.r - left.r) * amount;
        result.g = left.g + (right.g - left.g) * amount;
        result.b = left.b + (right.b - left.b) * amount;
        result.a = left.a + (right.a - left.a) * amount;
    };
    BABYLON.Color4.FromArray = function (array, offset) {
        if (!offset) {
            offset = 0;
        }
        return new BABYLON.Color4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
    };
    BABYLON.Color4.FromInts = function (r, g, b, a) {
        return new BABYLON.Color4(r / 255.0, g / 255.0, b / 255.0, a / 255.0);
    };
    BABYLON.Vector2 = function (initialX, initialY) {
        this.x = initialX;
        this.y = initialY;
    };
    BABYLON.Vector2.prototype.toString = function () {
        return "{X: " + this.x + " Y:" + this.y + "}";
    };
    BABYLON.Vector2.prototype.asArray = function () {
        var result = [];
        this.toArray(result, 0);
        return result;
    };
    BABYLON.Vector2.prototype.toArray = function (array, index) {
        if (index === undefined) {
            index = 0;
        }
        array[index] = this.x;
        array[index + 1] = this.y;
    };
    BABYLON.Vector2.prototype.add = function (otherVector) {
        return new BABYLON.Vector2(this.x + otherVector.x, this.y + otherVector.y);
    };
    BABYLON.Vector2.prototype.subtract = function (otherVector) {
        return new BABYLON.Vector2(this.x - otherVector.x, this.y - otherVector.y);
    };
    BABYLON.Vector2.prototype.negate = function () {
        return new BABYLON.Vector2(-this.x, -this.y);
    };
    BABYLON.Vector2.prototype.scaleInPlace = function (scale) {
        this.x *= scale;
        this.y *= scale;
    };
    BABYLON.Vector2.prototype.scale = function (scale) {
        return new BABYLON.Vector2(this.x * scale, this.y * scale);
    };
    BABYLON.Vector2.prototype.equals = function (otherVector) {
        return otherVector && this.x === otherVector.x && this.y === otherVector.y;
    };
    BABYLON.Vector2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    BABYLON.Vector2.prototype.lengthSquared = function () {
        return (this.x * this.x + this.y * this.y);
    };
    BABYLON.Vector2.prototype.normalize = function () {
        var len = this.length();
        if (len === 0) return;
        var num = 1.0 / len;
        this.x *= num;
        this.y *= num;
    };
    BABYLON.Vector2.prototype.clone = function () {
        return new BABYLON.Vector2(this.x, this.y);
    };
    BABYLON.Vector2.Zero = function () {
        return new BABYLON.Vector2(0, 0);
    };
    BABYLON.Vector2.CatmullRom = function (value1, value2, value3, value4, amount) {
        var squared = amount * amount;
        var cubed = amount * squared;
        var x = 0.5 * ((((2.0 * value2.x) + ((-value1.x + value3.x) * amount)) + (((((2.0 * value1.x) - (5.0 * value2.x)) + (4.0 * value3.x)) - value4.x) * squared)) + ((((-value1.x + (3.0 * value2.x)) - (3.0 * value3.x)) + value4.x) * cubed));
        var y = 0.5 * ((((2.0 * value2.y) + ((-value1.y + value3.y) * amount)) + (((((2.0 * value1.y) - (5.0 * value2.y)) + (4.0 * value3.y)) - value4.y) * squared)) + ((((-value1.y + (3.0 * value2.y)) - (3.0 * value3.y)) + value4.y) * cubed));
        return new BABYLON.Vector2(x, y);
    };
    BABYLON.Vector2.Clamp = function (value, min, max) {
        var x = value.x;
        x = (x > max.x) ? max.x : x;
        x = (x < min.x) ? min.x : x;
        var y = value.y;
        y = (y > max.y) ? max.y : y;
        y = (y < min.y) ? min.y : y;
        return new BABYLON.Vector2(x, y);
    };
    BABYLON.Vector2.Hermite = function (value1, tangent1, value2, tangent2, amount) {
        var squared = amount * amount;
        var cubed = amount * squared;
        var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
        var part2 = (-2.0 * cubed) + (3.0 * squared);
        var part3 = (cubed - (2.0 * squared)) + amount;
        var part4 = cubed - squared;
        var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
        var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
        return new BABYLON.Vector2(x, y);
    };
    BABYLON.Vector2.Lerp = function (start, end, amount) {
        var x = start.x + ((end.x - start.x) * amount);
        var y = start.y + ((end.y - start.y) * amount);
        return new BABYLON.Vector2(x, y);
    };
    BABYLON.Vector2.Dot = function (left, right) {
        return left.x * right.x + left.y * right.y;
    };
    BABYLON.Vector2.Normalize = function (vector) {
        var newVector = vector.clone();
        newVector.normalize();
        return newVector;
    };
    BABYLON.Vector2.Minimize = function (left, right) {
        var x = (left.x < right.x) ? left.x : right.x;
        var y = (left.y < right.y) ? left.y : right.y;
        return new BABYLON.Vector2(x, y);
    };
    BABYLON.Vector2.Maximize = function (left, right) {
        var x = (left.x > right.x) ? left.x : right.x;
        var y = (left.y > right.y) ? left.y : right.y;
        return new BABYLON.Vector2(x, y);
    };
    BABYLON.Vector2.Transform = function (vector, transformation) {
        var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]);
        var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]);
        return new BABYLON.Vector2(x, y);
    };
    BABYLON.Vector2.Distance = function (value1, value2) {
        return Math.sqrt(BABYLON.Vector2.DistanceSquared(value1, value2));
    };
    BABYLON.Vector2.DistanceSquared = function (value1, value2) {
        var x = value1.x - value2.x;
        var y = value1.y - value2.y;
        return (x * x) + (y * y);
    };
    BABYLON.Vector3 = function (initialX, initialY, initialZ) {
        this.x = initialX;
        this.y = initialY;
        this.z = initialZ;
    };
    BABYLON.Vector3.prototype.toString = function () {
        return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
    };
    BABYLON.Vector3.prototype.asArray = function () {
        var result = [];
        this.toArray(result, 0);
        return result;
    };
    BABYLON.Vector3.prototype.toArray = function (array, index) {
        if (index === undefined) {
            index = 0;
        }
        array[index] = this.x;
        array[index + 1] = this.y;
        array[index + 2] = this.z;
    };
    BABYLON.Vector3.prototype.addInPlace = function (otherVector) {
        this.x += otherVector.x;
        this.y += otherVector.y;
        this.z += otherVector.z;
    };
    BABYLON.Vector3.prototype.add = function (otherVector) {
        return new BABYLON.Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
    };
    BABYLON.Vector3.prototype.addToRef = function (otherVector, result) {
        result.x = this.x + otherVector.x;
        result.y = this.y + otherVector.y;
        result.z = this.z + otherVector.z;
    };
    BABYLON.Vector3.prototype.subtractInPlace = function (otherVector) {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
        this.z -= otherVector.z;
    };
    BABYLON.Vector3.prototype.subtract = function (otherVector) {
        return new BABYLON.Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
    };
    BABYLON.Vector3.prototype.subtractToRef = function (otherVector, result) {
        result.x = this.x - otherVector.x;
        result.y = this.y - otherVector.y;
        result.z = this.z - otherVector.z;
    };
    BABYLON.Vector3.prototype.subtractFromFloats = function (x, y, z) {
        return new BABYLON.Vector3(this.x - x, this.y - y, this.z - z);
    };
    BABYLON.Vector3.prototype.subtractFromFloatsToRef = function (x, y, z, result) {
        result.x = this.x - x;
        result.y = this.y - y;
        result.z = this.z - z;
    };
    BABYLON.Vector3.prototype.negate = function () {
        return new BABYLON.Vector3(-this.x, -this.y, -this.z);
    };
    BABYLON.Vector3.prototype.scaleInPlace = function (scale) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
    };
    BABYLON.Vector3.prototype.scale = function (scale) {
        return new BABYLON.Vector3(this.x * scale, this.y * scale, this.z * scale);
    };
    BABYLON.Vector3.prototype.scaleToRef = function (scale, result) {
        result.x = this.x * scale;
        result.y = this.y * scale;
        result.z = this.z * scale;
    };
    BABYLON.Vector3.prototype.equals = function (otherVector) {
        return otherVector && this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z;
    };
    BABYLON.Vector3.prototype.equalsToFloats = function (x, y, z) {
        return this.x === x && this.y === y && this.z === z;
    };
    BABYLON.Vector3.prototype.multiplyInPlace = function (otherVector) {
        this.x *= otherVector.x;
        this.y *= otherVector.y;
        this.z *= otherVector.z;
    };
    BABYLON.Vector3.prototype.multiply = function (otherVector) {
        return new BABYLON.Vector3(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z);
    };
    BABYLON.Vector3.prototype.multiplyToRef = function (otherVector, result) {
        result.x = this.x * otherVector.x;
        result.y = this.y * otherVector.y;
        result.z = this.z * otherVector.z;
    };
    BABYLON.Vector3.prototype.multiplyByFloats = function (x, y, z) {
        return new BABYLON.Vector3(this.x * x, this.y * y, this.z * z);
    };
    BABYLON.Vector3.prototype.divide = function (otherVector) {
        return new BABYLON.Vector3(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
    };
    BABYLON.Vector3.prototype.divideToRef = function (otherVector, result) {
        result.x = this.x / otherVector.x;
        result.y = this.y / otherVector.y;
        result.z = this.z / otherVector.z;
    };
    BABYLON.Vector3.prototype.MinimizeInPlace = function (other) {
        if (other.x < this.x) this.x = other.x;
        if (other.y < this.y) this.y = other.y;
        if (other.z < this.z) this.z = other.z;
    };
    BABYLON.Vector3.prototype.MaximizeInPlace = function (other) {
        if (other.x > this.x) this.x = other.x;
        if (other.y > this.y) this.y = other.y;
        if (other.z > this.z) this.z = other.z;
    };
    BABYLON.Vector3.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    BABYLON.Vector3.prototype.lengthSquared = function () {
        return (this.x * this.x + this.y * this.y + this.z * this.z);
    };
    BABYLON.Vector3.prototype.normalize = function () {
        var len = this.length();
        if (len === 0) return;
        var num = 1.0 / len;
        this.x *= num;
        this.y *= num;
        this.z *= num;
    };
    BABYLON.Vector3.prototype.clone = function () {
        return new BABYLON.Vector3(this.x, this.y, this.z);
    };
    BABYLON.Vector3.prototype.copyFrom = function (source) {
        this.x = source.x;
        this.y = source.y;
        this.z = source.z;
    };
    BABYLON.Vector3.prototype.copyFromFloats = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };
    BABYLON.Vector3.FromArray = function (array, offset) {
        if (!offset) {
            offset = 0;
        }
        return new BABYLON.Vector3(array[offset], array[offset + 1], array[offset + 2]);
    };
    BABYLON.Vector3.FromArrayToRef = function (array, offset, result) {
        if (!offset) {
            offset = 0;
        }
        result.x = array[offset];
        result.y = array[offset + 1];
        result.z = array[offset + 2];
    };
    BABYLON.Vector3.FromFloatsToRef = function (x, y, z, result) {
        result.x = x;
        result.y = y;
        result.z = z;
    };
    BABYLON.Vector3.Zero = function () {
        return new BABYLON.Vector3(0, 0, 0);
    };
    BABYLON.Vector3.Up = function () {
        return new BABYLON.Vector3(0, 1.0, 0);
    };
    BABYLON.Vector3.TransformCoordinates = function (vector, transformation) {
        var result = BABYLON.Vector3.Zero();
        BABYLON.Vector3.TransformCoordinatesToRef(vector, transformation, result);
        return result;
    };
    BABYLON.Vector3.TransformCoordinatesToRef = function (vector, transformation, result) {
        var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
        var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
        var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
        var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
        result.x = x / w;
        result.y = y / w;
        result.z = z / w;
    };
    BABYLON.Vector3.TransformCoordinatesFromFloatsToRef = function (x, y, z, transformation, result) {
        var rx = (x * transformation.m[0]) + (y * transformation.m[4]) + (z * transformation.m[8]) + transformation.m[12];
        var ry = (x * transformation.m[1]) + (y * transformation.m[5]) + (z * transformation.m[9]) + transformation.m[13];
        var rz = (x * transformation.m[2]) + (y * transformation.m[6]) + (z * transformation.m[10]) + transformation.m[14];
        var rw = (x * transformation.m[3]) + (y * transformation.m[7]) + (z * transformation.m[11]) + transformation.m[15];
        result.x = rx / rw;
        result.y = ry / rw;
        result.z = rz / rw;
    };
    BABYLON.Vector3.TransformNormal = function (vector, transformation) {
        var result = BABYLON.Vector3.Zero();
        BABYLON.Vector3.TransformNormalToRef(vector, transformation, result);
        return result;
    };
    BABYLON.Vector3.TransformNormalToRef = function (vector, transformation, result) {
        result.x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
        result.y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
        result.z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
    };
    BABYLON.Vector3.TransformNormalFromFloatsToRef = function (x, y, z, transformation, result) {
        result.x = (x * transformation.m[0]) + (y * transformation.m[4]) + (z * transformation.m[8]);
        result.y = (x * transformation.m[1]) + (y * transformation.m[5]) + (z * transformation.m[9]);
        result.z = (x * transformation.m[2]) + (y * transformation.m[6]) + (z * transformation.m[10]);
    };
    BABYLON.Vector3.CatmullRom = function (value1, value2, value3, value4, amount) {
        var squared = amount * amount;
        var cubed = amount * squared;
        var x = 0.5 * ((((2.0 * value2.x) + ((-value1.x + value3.x) * amount)) + (((((2.0 * value1.x) - (5.0 * value2.x)) + (4.0 * value3.x)) - value4.x) * squared)) + ((((-value1.x + (3.0 * value2.x)) - (3.0 * value3.x)) + value4.x) * cubed));
        var y = 0.5 * ((((2.0 * value2.y) + ((-value1.y + value3.y) * amount)) + (((((2.0 * value1.y) - (5.0 * value2.y)) + (4.0 * value3.y)) - value4.y) * squared)) + ((((-value1.y + (3.0 * value2.y)) - (3.0 * value3.y)) + value4.y) * cubed));
        var z = 0.5 * ((((2.0 * value2.z) + ((-value1.z + value3.z) * amount)) + (((((2.0 * value1.z) - (5.0 * value2.z)) + (4.0 * value3.z)) - value4.z) * squared)) + ((((-value1.z + (3.0 * value2.z)) - (3.0 * value3.z)) + value4.z) * cubed));
        return new BABYLON.Vector3(x, y, z);
    };
    BABYLON.Vector3.Clamp = function (value, min, max) {
        var x = value.x;
        x = (x > max.x) ? max.x : x;
        x = (x < min.x) ? min.x : x;
        var y = value.y;
        y = (y > max.y) ? max.y : y;
        y = (y < min.y) ? min.y : y;
        var z = value.z;
        z = (z > max.z) ? max.z : z;
        z = (z < min.z) ? min.z : z;
        return new BABYLON.Vector3(x, y, z);
    };
    BABYLON.Vector3.Hermite = function (value1, tangent1, value2, tangent2, amount) {
        var squared = amount * amount;
        var cubed = amount * squared;
        var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
        var part2 = (-2.0 * cubed) + (3.0 * squared);
        var part3 = (cubed - (2.0 * squared)) + amount;
        var part4 = cubed - squared;
        var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
        var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
        var z = (((value1.z * part1) + (value2.z * part2)) + (tangent1.z * part3)) + (tangent2.z * part4);
        return new BABYLON.Vector3(x, y, z);
    };
    BABYLON.Vector3.Lerp = function (start, end, amount) {
        var x = start.x + ((end.x - start.x) * amount);
        var y = start.y + ((end.y - start.y) * amount);
        var z = start.z + ((end.z - start.z) * amount);
        return new BABYLON.Vector3(x, y, z);
    };
    BABYLON.Vector3.Dot = function (left, right) {
        return (left.x * right.x + left.y * right.y + left.z * right.z);
    };
    BABYLON.Vector3.Cross = function (left, right) {
        var result = BABYLON.Vector3.Zero();
        BABYLON.Vector3.CrossToRef(left, right, result);
        return result;
    };
    BABYLON.Vector3.CrossToRef = function (left, right, result) {
        result.x = left.y * right.z - left.z * right.y;
        result.y = left.z * right.x - left.x * right.z;
        result.z = left.x * right.y - left.y * right.x;
    };
    BABYLON.Vector3.Normalize = function (vector) {
        var result = BABYLON.Vector3.Zero();
        BABYLON.Vector3.NormalizeToRef(vector, result);
        return result;
    };
    BABYLON.Vector3.NormalizeToRef = function (vector, result) {
        result.copyFrom(vector);
        result.normalize();
    };
    BABYLON.Vector3.Project = function (vector, world, transform, viewport) {
        var cw = viewport.width;
        var ch = viewport.height;
        var cx = viewport.x;
        var cy = viewport.y;
        var viewportMatrix = BABYLON.Matrix.FromValues(cw / 2.0, 0, 0, 0, 0, -ch / 2.0, 0, 0, 0, 0, 1, 0, cx + cw / 2.0, ch / 2.0 + cy, 0, 1);
        var finalMatrix = world.multiply(transform).multiply(viewportMatrix);
        return BABYLON.Vector3.TransformCoordinates(vector, finalMatrix);
    };
    BABYLON.Vector3.Unproject = function (source, viewportWidth, viewportHeight, world, view, projection) {
        var matrix = world.multiply(view).multiply(projection);
        matrix.invert();
        source.x = source.x / viewportWidth * 2 - 1;
        source.y = -(source.y / viewportHeight * 2 - 1);
        var vector = BABYLON.Vector3.TransformCoordinates(source, matrix);
        var num = source.x * matrix.m[3] + source.y * matrix.m[7] + source.z * matrix.m[11] + matrix.m[15];
        if (BABYLON.Tools.WithinEpsilon(num, 1.0)) {
            vector = vector.scale(1.0 / num);
        }
        return vector;
    };
    BABYLON.Vector3.Minimize = function (left, right) {
        var min = left.clone();
        min.MinimizeInPlace(right);
        return min;
    };
    BABYLON.Vector3.Maximize = function (left, right) {
        var max = left.clone();
        max.MaximizeInPlace(right);
        return max;
    };
    BABYLON.Vector3.Distance = function (value1, value2) {
        return Math.sqrt(BABYLON.Vector3.DistanceSquared(value1, value2));
    };
    BABYLON.Vector3.DistanceSquared = function (value1, value2) {
        var x = value1.x - value2.x;
        var y = value1.y - value2.y;
        var z = value1.z - value2.z;
        return (x * x) + (y * y) + (z * z);
    };
    BABYLON.Vector3.Center = function (value1, value2) {
        var center = value1.add(value2);
        center.scaleInPlace(0.5);
        return center;
    };
    BABYLON.Quaternion = function (initialX, initialY, initialZ, initialW) {
        this.x = initialX;
        this.y = initialY;
        this.z = initialZ;
        this.w = initialW;
    };
    BABYLON.Quaternion.prototype.toString = function () {
        return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + " W:" + this.w + "}";
    };
    BABYLON.Quaternion.prototype.asArray = function () {
        return [this.x, this.y, this.z, this.w];
    };
    BABYLON.Quaternion.prototype.equals = function (otherQuaternion) {
        return otherQuaternion && this.x === otherQuaternion.x && this.y === otherQuaternion.y && this.z === otherQuaternion.z && this.w === otherQuaternion.w;
    };
    BABYLON.Quaternion.prototype.clone = function () {
        return new BABYLON.Quaternion(this.x, this.y, this.z, this.w);
    };
    BABYLON.Quaternion.prototype.copyFrom = function (other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        this.w = other.w;
    };
    BABYLON.Quaternion.prototype.add = function (other) {
        return new BABYLON.Quaternion(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
    };
    BABYLON.Quaternion.prototype.scale = function (value) {
        return new BABYLON.Quaternion(this.x * value, this.y * value, this.z * value, this.w * value);
    };
    BABYLON.Quaternion.prototype.multiply = function (q1) {
        var result = new BABYLON.Quaternion(0, 0, 0, 1.0);
        this.multiplyToRef(q1, result);
        return result;
    };
    BABYLON.Quaternion.prototype.multiplyToRef = function (q1, result) {
        result.x = this.x * q1.w + this.y * q1.z - this.z * q1.y + this.w * q1.x;
        result.y = -this.x * q1.z + this.y * q1.w + this.z * q1.x + this.w * q1.y;
        result.z = this.x * q1.y - this.y * q1.x + this.z * q1.w + this.w * q1.z;
        result.w = -this.x * q1.x - this.y * q1.y - this.z * q1.z + this.w * q1.w;
    };
    BABYLON.Quaternion.prototype.length = function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
    };
    BABYLON.Quaternion.prototype.normalize = function () {
        var length = 1.0 / this.length();
        this.x *= length;
        this.y *= length;
        this.z *= length;
        this.w *= length;
    };
    BABYLON.Quaternion.prototype.toEulerAngles = function () {
        var qx = this.x;
        var qy = this.y;
        var qz = this.z;
        var qw = this.w;
        var sqx = qx * qx;
        var sqy = qy * qy;
        var sqz = qz * qz;
        var yaw = Math.atan2(2.0 * (qy * qw - qx * qz), 1.0 - 2.0 * (sqy + sqz));
        var pitch = Math.asin(2.0 * (qx * qy + qz * qw));
        var roll = Math.atan2(2.0 * (qx * qw - qy * qz), 1.0 - 2.0 * (sqx + sqz));
        var gimbaLockTest = qx * qy + qz * qw;
        if (gimbaLockTest > 0.499) {
            yaw = 2.0 * Math.atan2(qx, qw);
            roll = 0;
        } else if (gimbaLockTest < -0.499) {
            yaw = -2.0 * Math.atan2(qx, qw);
            roll = 0;
        }
        return new BABYLON.Vector3(pitch, yaw, roll);
    };
    BABYLON.Quaternion.prototype.toRotationMatrix = function (result) {
        var xx = this.x * this.x;
        var yy = this.y * this.y;
        var zz = this.z * this.z;
        var xy = this.x * this.y;
        var zw = this.z * this.w;
        var zx = this.z * this.x;
        var yw = this.y * this.w;
        var yz = this.y * this.z;
        var xw = this.x * this.w;
        result.m[0] = 1.0 - (2.0 * (yy + zz));
        result.m[1] = 2.0 * (xy + zw);
        result.m[2] = 2.0 * (zx - yw);
        result.m[3] = 0;
        result.m[4] = 2.0 * (xy - zw);
        result.m[5] = 1.0 - (2.0 * (zz + xx));
        result.m[6] = 2.0 * (yz + xw);
        result.m[7] = 0;
        result.m[8] = 2.0 * (zx + yw);
        result.m[9] = 2.0 * (yz - xw);
        result.m[10] = 1.0 - (2.0 * (yy + xx));
        result.m[11] = 0;
        result.m[12] = 0;
        result.m[13] = 0;
        result.m[14] = 0;
        result.m[15] = 1.0;
    };
    BABYLON.Quaternion.RotationAxis = function (axis, angle) {
        var result = new BABYLON.Quaternion();
        var sin = Math.sin(angle / 2);
        result.w = Math.cos(angle / 2);
        result.x = axis.x * sin;
        result.y = axis.y * sin;
        result.z = axis.z * sin;
        return result;
    };
    BABYLON.Quaternion.FromArray = function (array, offset) {
        if (!offset) {
            offset = 0;
        }
        return new BABYLON.Quaternion(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
    };
    BABYLON.Quaternion.RotationYawPitchRoll = function (yaw, pitch, roll) {
        var result = new BABYLON.Quaternion();
        BABYLON.Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, result);
        return result;
    };
    BABYLON.Quaternion.RotationYawPitchRollToRef = function (yaw, pitch, roll, result) {
        var halfRoll = roll * 0.5;
        var halfPitch = pitch * 0.5;
        var halfYaw = yaw * 0.5;
        var sinRoll = Math.sin(halfRoll);
        var cosRoll = Math.cos(halfRoll);
        var sinPitch = Math.sin(halfPitch);
        var cosPitch = Math.cos(halfPitch);
        var sinYaw = Math.sin(halfYaw);
        var cosYaw = Math.cos(halfYaw);
        result.x = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);
        result.y = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);
        result.z = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);
        result.w = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);
    };
    BABYLON.Quaternion.Slerp = function (left, right, amount) {
        var num2;
        var num3;
        var num = amount;
        var num4 = (((left.x * right.x) + (left.y * right.y)) + (left.z * right.z)) + (left.w * right.w);
        var flag = false;
        if (num4 < 0) {
            flag = true;
            num4 = -num4;
        }
        if (num4 > 0.999999) {
            num3 = 1 - num;
            num2 = flag ? -num : num;
        } else {
            var num5 = Math.acos(num4);
            var num6 = (1.0 / Math.sin(num5));
            num3 = (Math.sin((1.0 - num) * num5)) * num6;
            num2 = flag ? ((-Math.sin(num * num5)) * num6) : ((Math.sin(num * num5)) * num6);
        }
        return new BABYLON.Quaternion((num3 * left.x) + (num2 * right.x), (num3 * left.y) + (num2 * right.y), (num3 * left.z) + (num2 * right.z), (num3 * left.w) + (num2 * right.w));
    };
    if (!BABYLON.MatrixType) {
        BABYLON.MatrixType = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
    }
    BABYLON.Matrix = function () {
        this.m = new BABYLON.MatrixType(16);
    };
    BABYLON.Matrix.prototype.isIdentity = function () {
        if (this.m[0] != 1.0 || this.m[5] != 1.0 || this.m[10] != 1.0 || this.m[15] != 1.0) return false;
        if (this.m[1] != 0.0 || this.m[2] != 0.0 || this.m[3] != 0.0 || this.m[4] != 0.0 || this.m[6] != 0.0 || this.m[7] != 0.0 || this.m[8] != 0.0 || this.m[9] != 0.0 || this.m[11] != 0.0 || this.m[12] != 0.0 || this.m[13] != 0.0 || this.m[14] != 0.0) return false;
        return true;
    };
    BABYLON.Matrix.prototype.determinant = function () {
        var temp1 = (this.m[10] * this.m[15]) - (this.m[11] * this.m[14]);
        var temp2 = (this.m[9] * this.m[15]) - (this.m[11] * this.m[13]);
        var temp3 = (this.m[9] * this.m[14]) - (this.m[10] * this.m[13]);
        var temp4 = (this.m[8] * this.m[15]) - (this.m[11] * this.m[12]);
        var temp5 = (this.m[8] * this.m[14]) - (this.m[10] * this.m[12]);
        var temp6 = (this.m[8] * this.m[13]) - (this.m[9] * this.m[12]);
        return ((((this.m[0] * (((this.m[5] * temp1) - (this.m[6] * temp2)) + (this.m[7] * temp3))) - (this.m[1] * (((this.m[4] * temp1) - (this.m[6] * temp4)) + (this.m[7] * temp5)))) + (this.m[2] * (((this.m[4] * temp2) - (this.m[5] * temp4)) + (this.m[7] * temp6)))) - (this.m[3] * (((this.m[4] * temp3) - (this.m[5] * temp5)) + (this.m[6] * temp6))));
    };
    BABYLON.Matrix.prototype.toArray = function () {
        return this.m;
    };
    BABYLON.Matrix.prototype.asArray = function () {
        return this.toArray();
    };
    BABYLON.Matrix.prototype.invert = function () {
        this.invertToRef(this);
    };
    BABYLON.Matrix.prototype.invertToRef = function (other) {
        var l1 = this.m[0];
        var l2 = this.m[1];
        var l3 = this.m[2];
        var l4 = this.m[3];
        var l5 = this.m[4];
        var l6 = this.m[5];
        var l7 = this.m[6];
        var l8 = this.m[7];
        var l9 = this.m[8];
        var l10 = this.m[9];
        var l11 = this.m[10];
        var l12 = this.m[11];
        var l13 = this.m[12];
        var l14 = this.m[13];
        var l15 = this.m[14];
        var l16 = this.m[15];
        var l17 = (l11 * l16) - (l12 * l15);
        var l18 = (l10 * l16) - (l12 * l14);
        var l19 = (l10 * l15) - (l11 * l14);
        var l20 = (l9 * l16) - (l12 * l13);
        var l21 = (l9 * l15) - (l11 * l13);
        var l22 = (l9 * l14) - (l10 * l13);
        var l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
        var l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
        var l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
        var l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
        var l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
        var l28 = (l7 * l16) - (l8 * l15);
        var l29 = (l6 * l16) - (l8 * l14);
        var l30 = (l6 * l15) - (l7 * l14);
        var l31 = (l5 * l16) - (l8 * l13);
        var l32 = (l5 * l15) - (l7 * l13);
        var l33 = (l5 * l14) - (l6 * l13);
        var l34 = (l7 * l12) - (l8 * l11);
        var l35 = (l6 * l12) - (l8 * l10);
        var l36 = (l6 * l11) - (l7 * l10);
        var l37 = (l5 * l12) - (l8 * l9);
        var l38 = (l5 * l11) - (l7 * l9);
        var l39 = (l5 * l10) - (l6 * l9);
        other.m[0] = l23 * l27;
        other.m[4] = l24 * l27;
        other.m[8] = l25 * l27;
        other.m[12] = l26 * l27;
        other.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
        other.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
        other.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
        other.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
        other.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
        other.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
        other.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
        other.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
        other.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
        other.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
        other.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
        other.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
    };
    BABYLON.Matrix.prototype.setTranslation = function (vector3) {
        this.m[12] = vector3.x;
        this.m[13] = vector3.y;
        this.m[14] = vector3.z;
    };
    BABYLON.Matrix.prototype.multiply = function (other) {
        var result = new BABYLON.Matrix();
        this.multiplyToRef(other, result);
        return result;
    };
    BABYLON.Matrix.prototype.copyFrom = function (other) {
        for (var index = 0; index < 16; index++) {
            this.m[index] = other.m[index];
        }
    };
    BABYLON.Matrix.prototype.multiplyToRef = function (other, result) {
        this.multiplyToArray(other, result.m, 0);
    };
    BABYLON.Matrix.prototype.multiplyToArray = function (other, result, offset) {
        var tm0 = this.m[0];
        var tm1 = this.m[1];
        var tm2 = this.m[2];
        var tm3 = this.m[3];
        var tm4 = this.m[4];
        var tm5 = this.m[5];
        var tm6 = this.m[6];
        var tm7 = this.m[7];
        var tm8 = this.m[8];
        var tm9 = this.m[9];
        var tm10 = this.m[10];
        var tm11 = this.m[11];
        var tm12 = this.m[12];
        var tm13 = this.m[13];
        var tm14 = this.m[14];
        var tm15 = this.m[15];
        var om0 = other.m[0];
        var om1 = other.m[1];
        var om2 = other.m[2];
        var om3 = other.m[3];
        var om4 = other.m[4];
        var om5 = other.m[5];
        var om6 = other.m[6];
        var om7 = other.m[7];
        var om8 = other.m[8];
        var om9 = other.m[9];
        var om10 = other.m[10];
        var om11 = other.m[11];
        var om12 = other.m[12];
        var om13 = other.m[13];
        var om14 = other.m[14];
        var om15 = other.m[15];
        result[offset] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12;
        result[offset + 1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13;
        result[offset + 2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14;
        result[offset + 3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15;
        result[offset + 4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12;
        result[offset + 5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13;
        result[offset + 6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14;
        result[offset + 7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15;
        result[offset + 8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12;
        result[offset + 9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13;
        result[offset + 10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14;
        result[offset + 11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15;
        result[offset + 12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12;
        result[offset + 13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13;
        result[offset + 14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14;
        result[offset + 15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15;
    };
    BABYLON.Matrix.prototype.equals = function (value) {
        return value && (this.m[0] === value.m[0] && this.m[1] === value.m[1] && this.m[2] === value.m[2] && this.m[3] === value.m[3] && this.m[4] === value.m[4] && this.m[5] === value.m[5] && this.m[6] === value.m[6] && this.m[7] === value.m[7] && this.m[8] === value.m[8] && this.m[9] === value.m[9] && this.m[10] === value.m[10] && this.m[11] === value.m[11] && this.m[12] === value.m[12] && this.m[13] === value.m[13] && this.m[14] === value.m[14] && this.m[15] === value.m[15]);
    };
    BABYLON.Matrix.prototype.clone = function () {
        return BABYLON.Matrix.FromValues(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5], this.m[6], this.m[7], this.m[8], this.m[9], this.m[10], this.m[11], this.m[12], this.m[13], this.m[14], this.m[15]);
    };
    BABYLON.Matrix.FromArray = function (array, offset) {
        var result = new BABYLON.Matrix();
        BABYLON.Matrix.FromArrayToRef(array, offset, result);
        return result;
    };
    BABYLON.Matrix.FromArrayToRef = function (array, offset, result) {
        if (!offset) {
            offset = 0;
        }
        for (var index = 0; index < 16; index++) {
            result.m[index] = array[index + offset];
        }
    };
    BABYLON.Matrix.FromValuesToRef = function (initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44, result) {
        result.m[0] = initialM11;
        result.m[1] = initialM12;
        result.m[2] = initialM13;
        result.m[3] = initialM14;
        result.m[4] = initialM21;
        result.m[5] = initialM22;
        result.m[6] = initialM23;
        result.m[7] = initialM24;
        result.m[8] = initialM31;
        result.m[9] = initialM32;
        result.m[10] = initialM33;
        result.m[11] = initialM34;
        result.m[12] = initialM41;
        result.m[13] = initialM42;
        result.m[14] = initialM43;
        result.m[15] = initialM44;
    };
    BABYLON.Matrix.FromValues = function (initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44) {
        var result = new BABYLON.Matrix();
        result.m[0] = initialM11;
        result.m[1] = initialM12;
        result.m[2] = initialM13;
        result.m[3] = initialM14;
        result.m[4] = initialM21;
        result.m[5] = initialM22;
        result.m[6] = initialM23;
        result.m[7] = initialM24;
        result.m[8] = initialM31;
        result.m[9] = initialM32;
        result.m[10] = initialM33;
        result.m[11] = initialM34;
        result.m[12] = initialM41;
        result.m[13] = initialM42;
        result.m[14] = initialM43;
        result.m[15] = initialM44;
        return result;
    };
    BABYLON.Matrix.Identity = function () {
        return BABYLON.Matrix.FromValues(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0);
    };
    BABYLON.Matrix.IdentityToRef = function (result) {
        BABYLON.Matrix.FromValuesToRef(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, result);
    };
    BABYLON.Matrix.Zero = function () {
        return BABYLON.Matrix.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    };
    BABYLON.Matrix.RotationX = function (angle) {
        var result = new BABYLON.Matrix();
        BABYLON.Matrix.RotationXToRef(angle, result);
        return result;
    };
    BABYLON.Matrix.RotationXToRef = function (angle, result) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        result.m[0] = 1.0;
        result.m[15] = 1.0;
        result.m[5] = c;
        result.m[10] = c;
        result.m[9] = -s;
        result.m[6] = s;
        result.m[1] = 0;
        result.m[2] = 0;
        result.m[3] = 0;
        result.m[4] = 0;
        result.m[7] = 0;
        result.m[8] = 0;
        result.m[11] = 0;
        result.m[12] = 0;
        result.m[13] = 0;
        result.m[14] = 0;
    };
    BABYLON.Matrix.RotationY = function (angle) {
        var result = new BABYLON.Matrix();
        BABYLON.Matrix.RotationYToRef(angle, result);
        return result;
    };
    BABYLON.Matrix.RotationYToRef = function (angle, result) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        result.m[5] = 1.0;
        result.m[15] = 1.0;
        result.m[0] = c;
        result.m[2] = -s;
        result.m[8] = s;
        result.m[10] = c;
        result.m[1] = 0;
        result.m[3] = 0;
        result.m[4] = 0;
        result.m[6] = 0;
        result.m[7] = 0;
        result.m[9] = 0;
        result.m[11] = 0;
        result.m[12] = 0;
        result.m[13] = 0;
        result.m[14] = 0;
    };
    BABYLON.Matrix.RotationZ = function (angle) {
        var result = new BABYLON.Matrix();
        BABYLON.Matrix.RotationZToRef(angle, result);
        return result;
    };
    BABYLON.Matrix.RotationZToRef = function (angle, result) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        result.m[10] = 1.0;
        result.m[15] = 1.0;
        result.m[0] = c;
        result.m[1] = s;
        result.m[4] = -s;
        result.m[5] = c;
        result.m[2] = 0;
        result.m[3] = 0;
        result.m[6] = 0;
        result.m[7] = 0;
        result.m[8] = 0;
        result.m[9] = 0;
        result.m[11] = 0;
        result.m[12] = 0;
        result.m[13] = 0;
        result.m[14] = 0;
    };
    BABYLON.Matrix.RotationAxis = function (axis, angle) {
        var s = Math.sin(-angle);
        var c = Math.cos(-angle);
        var c1 = 1 - c;
        axis.normalize();
        var result = BABYLON.Matrix.Zero();
        result.m[0] = (axis.x * axis.x) * c1 + c;
        result.m[1] = (axis.x * axis.y) * c1 - (axis.z * s);
        result.m[2] = (axis.x * axis.z) * c1 + (axis.y * s);
        result.m[3] = 0.0;
        result.m[4] = (axis.y * axis.x) * c1 + (axis.z * s);
        result.m[5] = (axis.y * axis.y) * c1 + c;
        result.m[6] = (axis.y * axis.z) * c1 - (axis.x * s);
        result.m[7] = 0.0;
        result.m[8] = (axis.z * axis.x) * c1 - (axis.y * s);
        result.m[9] = (axis.z * axis.y) * c1 + (axis.x * s);
        result.m[10] = (axis.z * axis.z) * c1 + c;
        result.m[11] = 0.0;
        result.m[15] = 1.0;
        return result;
    };
    BABYLON.Matrix.RotationYawPitchRoll = function (yaw, pitch, roll) {
        var result = new BABYLON.Matrix();
        BABYLON.Matrix.RotationYawPitchRollToRef(yaw, pitch, roll, result);
        return result;
    };
    var tempQuaternion = new BABYLON.Quaternion();
    BABYLON.Matrix.RotationYawPitchRollToRef = function (yaw, pitch, roll, result) {
        BABYLON.Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, tempQuaternion);
        tempQuaternion.toRotationMatrix(result);
    };
    BABYLON.Matrix.Scaling = function (x, y, z) {
        var result = BABYLON.Matrix.Zero();
        BABYLON.Matrix.ScalingToRef(x, y, z, result);
        return result;
    };
    BABYLON.Matrix.ScalingToRef = function (x, y, z, result) {
        result.m[0] = x;
        result.m[1] = 0;
        result.m[2] = 0;
        result.m[3] = 0;
        result.m[4] = 0;
        result.m[5] = y;
        result.m[6] = 0;
        result.m[7] = 0;
        result.m[8] = 0;
        result.m[9] = 0;
        result.m[10] = z;
        result.m[11] = 0;
        result.m[12] = 0;
        result.m[13] = 0;
        result.m[14] = 0;
        result.m[15] = 1.0;
    };
    BABYLON.Matrix.Translation = function (x, y, z) {
        var result = BABYLON.Matrix.Identity();
        BABYLON.Matrix.TranslationToRef(x, y, z, result);
        return result;
    };
    BABYLON.Matrix.TranslationToRef = function (x, y, z, result) {
        BABYLON.Matrix.FromValuesToRef(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, x, y, z, 1.0, result);
    };
    BABYLON.Matrix.LookAtLH = function (eye, target, up) {
        var result = BABYLON.Matrix.Zero();
        BABYLON.Matrix.LookAtLHToRef(eye, target, up, result);
        return result;
    };
    var xAxis = BABYLON.Vector3.Zero();
    var yAxis = BABYLON.Vector3.Zero();
    var zAxis = BABYLON.Vector3.Zero();
    BABYLON.Matrix.LookAtLHToRef = function (eye, target, up, result) {
        target.subtractToRef(eye, zAxis);
        zAxis.normalize();
        BABYLON.Vector3.CrossToRef(up, zAxis, xAxis);
        xAxis.normalize();
        BABYLON.Vector3.CrossToRef(zAxis, xAxis, yAxis);
        yAxis.normalize();
        var ex = -BABYLON.Vector3.Dot(xAxis, eye);
        var ey = -BABYLON.Vector3.Dot(yAxis, eye);
        var ez = -BABYLON.Vector3.Dot(zAxis, eye);
        return BABYLON.Matrix.FromValuesToRef(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, ex, ey, ez, 1, result);
    };
    BABYLON.Matrix.OrthoLH = function (width, height, znear, zfar) {
        var hw = 2.0 / width;
        var hh = 2.0 / height;
        var id = 1.0 / (zfar - znear);
        var nid = znear / (znear - zfar);
        return BABYLON.Matrix.FromValues(hw, 0, 0, 0, 0, hh, 0, 0, 0, 0, id, 0, 0, 0, nid, 1);
    };
    BABYLON.Matrix.OrthoOffCenterLH = function (left, right, bottom, top, znear, zfar) {
        var matrix = BABYLON.Matrix.Zero();
        BABYLON.Matrix.OrthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, matrix);
        return matrix;
    };
    BABYLON.Matrix.OrthoOffCenterLHToRef = function (left, right, bottom, top, znear, zfar, result) {
        result.m[0] = 2.0 / (right - left);
        result.m[1] = result.m[2] = result.m[3] = 0;
        result.m[5] = 2.0 / (top - bottom);
        result.m[4] = result.m[6] = result.m[7] = 0;
        result.m[10] = -1.0 / (znear - zfar);
        result.m[8] = result.m[9] = result.m[11] = 0;
        result.m[12] = (left + right) / (left - right);
        result.m[13] = (top + bottom) / (bottom - top);
        result.m[14] = znear / (znear - zfar);
        result.m[15] = 1.0;
    };
    BABYLON.Matrix.PerspectiveLH = function (width, height, znear, zfar) {
        var matrix = BABYLON.Matrix.Zero();
        matrix.m[0] = (2.0 * znear) / width;
        matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
        matrix.m[5] = (2.0 * znear) / height;
        matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
        matrix.m[10] = -zfar / (znear - zfar);
        matrix.m[8] = matrix.m[9] = 0.0;
        matrix.m[11] = 1.0;
        matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
        matrix.m[14] = (znear * zfar) / (znear - zfar);
        return matrix;
    };
    BABYLON.Matrix.PerspectiveFovLH = function (fov, aspect, znear, zfar) {
        var matrix = BABYLON.Matrix.Zero();
        BABYLON.Matrix.PerspectiveFovLHToRef(fov, aspect, znear, zfar, matrix);
        return matrix;
    };
    BABYLON.Matrix.PerspectiveFovLHToRef = function (fov, aspect, znear, zfar, result) {
        var tan = 1.0 / (Math.tan(fov * 0.5));
        result.m[0] = tan / aspect;
        result.m[1] = result.m[2] = result.m[3] = 0.0;
        result.m[5] = tan;
        result.m[4] = result.m[6] = result.m[7] = 0.0;
        result.m[8] = result.m[9] = 0.0;
        result.m[10] = -zfar / (znear - zfar);
        result.m[11] = 1.0;
        result.m[12] = result.m[13] = result.m[15] = 0.0;
        result.m[14] = (znear * zfar) / (znear - zfar);
    };
    BABYLON.Matrix.AffineTransformation = function (scaling, rotationCenter, rotation, translation) {
        return BABYLON.Matrix.Scaling(scaling, scaling, scaling) * BABYLON.Matrix.Translation(-rotationCenter) * BABYLON.Matrix.RotationQuaternion(rotation) * BABYLON.Matrix.Translation(rotationCenter) * BABYLON.Matrix.Translation(translation);
    };
    BABYLON.Matrix.GetFinalMatrix = function (viewport, world, view, projection, zmin, zmax) {
        var cw = viewport.width;
        var ch = viewport.height;
        var cx = viewport.x;
        var cy = viewport.y;
        var viewportMatrix = new BABYLON.Matrix(cw / 2.0, 0, 0, 0, 0, -ch / 2.0, 0, 0, 0, 0, zmax - zmin, 0, cx + cw / 2.0, ch / 2.0 + cy, zmin, 1);
        return world.multiply(view).multiply(projection).multiply(viewportMatrix);
    };
    BABYLON.Matrix.Transpose = function (matrix) {
        var result = new BABYLON.Matrix();
        result.m[0] = matrix.m[0];
        result.m[1] = matrix.m[4];
        result.m[2] = matrix.m[8];
        result.m[3] = matrix.m[12];
        result.m[4] = matrix.m[1];
        result.m[5] = matrix.m[5];
        result.m[6] = matrix.m[9];
        result.m[7] = matrix.m[13];
        result.m[8] = matrix.m[2];
        result.m[9] = matrix.m[6];
        result.m[10] = matrix.m[10];
        result.m[11] = matrix.m[14];
        result.m[12] = matrix.m[3];
        result.m[13] = matrix.m[7];
        result.m[14] = matrix.m[11];
        result.m[15] = matrix.m[15];
        return result;
    };
    BABYLON.Matrix.Reflection = function (plane) {
        var matrix = new BABYLON.Matrix();
        BABYLON.Matrix.ReflectionToRef(plane, matrix);
        return matrix;
    };
    BABYLON.Matrix.ReflectionToRef = function (plane, result) {
        plane.normalize();
        var x = plane.normal.x;
        var y = plane.normal.y;
        var z = plane.normal.z;
        var temp = -2 * x;
        var temp2 = -2 * y;
        var temp3 = -2 * z;
        result.m[0] = (temp * x) + 1;
        result.m[1] = temp2 * x;
        result.m[2] = temp3 * x;
        result.m[3] = 0.0;
        result.m[4] = temp * y;
        result.m[5] = (temp2 * y) + 1;
        result.m[6] = temp3 * y;
        result.m[7] = 0.0;
        result.m[8] = temp * z;
        result.m[9] = temp2 * z;
        result.m[10] = (temp3 * z) + 1;
        result.m[11] = 0.0;
        result.m[12] = temp * plane.d;
        result.m[13] = temp2 * plane.d;
        result.m[14] = temp3 * plane.d;
        result.m[15] = 1.0;
    };
    BABYLON.Plane = function (a, b, c, d) {
        this.normal = new BABYLON.Vector3(a, b, c);
        this.d = d;
    };
    BABYLON.Plane.prototype.asArray = function () {
        return [this.normal.x, this.normal.y, this.normal.z, this.d];
    };
    BABYLON.Plane.prototype.normalize = function () {
        var norm = (Math.sqrt((this.normal.x * this.normal.x) + (this.normal.y * this.normal.y) + (this.normal.z * this.normal.z)));
        var magnitude = 0;
        if (norm != 0) {
            magnitude = 1.0 / norm;
        }
        this.normal.x *= magnitude;
        this.normal.y *= magnitude;
        this.normal.z *= magnitude;
        this.d *= magnitude;
    };
    BABYLON.Plane.prototype.transform = function (transformation) {
        var transposedMatrix = BABYLON.Matrix.Transpose(transformation);
        var x = this.normal.x;
        var y = this.normal.y;
        var z = this.normal.z;
        var d = this.d;
        var normalX = (((x * transposedMatrix.m[0]) + (y * transposedMatrix.m[1])) + (z * transposedMatrix.m[2])) + (d * transposedMatrix.m[3]);
        var normalY = (((x * transposedMatrix.m[4]) + (y * transposedMatrix.m[5])) + (z * transposedMatrix.m[6])) + (d * transposedMatrix.m[7]);
        var normalZ = (((x * transposedMatrix.m[8]) + (y * transposedMatrix.m[9])) + (z * transposedMatrix.m[10])) + (d * transposedMatrix.m[11]);
        var finalD = (((x * transposedMatrix.m[12]) + (y * transposedMatrix.m[13])) + (z * transposedMatrix.m[14])) + (d * transposedMatrix.m[15]);
        return new BABYLON.Plane(normalX, normalY, normalZ, finalD);
    };
    BABYLON.Plane.prototype.dotCoordinate = function (point) {
        return ((((this.normal.x * point.x) + (this.normal.y * point.y)) + (this.normal.z * point.z)) + this.d);
    };
    BABYLON.Plane.prototype.copyFromPoints = function (point1, point2, point3) {
        var x1 = point2.x - point1.x;
        var y1 = point2.y - point1.y;
        var z1 = point2.z - point1.z;
        var x2 = point3.x - point1.x;
        var y2 = point3.y - point1.y;
        var z2 = point3.z - point1.z;
        var yz = (y1 * z2) - (z1 * y2);
        var xz = (z1 * x2) - (x1 * z2);
        var xy = (x1 * y2) - (y1 * x2);
        var pyth = (Math.sqrt((yz * yz) + (xz * xz) + (xy * xy)));
        var invPyth;
        if (pyth != 0) {
            invPyth = 1.0 / pyth;
        } else {
            invPyth = 0;
        }
        this.normal.x = yz * invPyth;
        this.normal.y = xz * invPyth;
        this.normal.z = xy * invPyth;
        this.d = -((this.normal.x * point1.x) + (this.normal.y * point1.y) + (this.normal.z * point1.z));
    };
    BABYLON.Plane.prototype.isFrontFacingTo = function (direction, epsilon) {
        var dot = BABYLON.Vector3.Dot(this.normal, direction);
        return (dot <= epsilon);
    };
    BABYLON.Plane.prototype.signedDistanceTo = function (point) {
        return BABYLON.Vector3.Dot(point, this.normal) + this.d;
    };
    BABYLON.Plane.FromArray = function (array) {
        return new BABYLON.Plane(array[0], array[1], array[2], array[3]);
    };
    BABYLON.Plane.FromPoints = function (point1, point2, point3) {
        var result = new BABYLON.Plane(0, 0, 0, 0);
        result.copyFromPoints(point1, point2, point3);
        return result;
    };
    BABYLON.Plane.FromPositionAndNormal = function (origin, normal) {
        var result = new BABYLON.Plane(0, 0, 0, 0);
        normal.normalize();
        result.normal = normal;
        result.d = -(normal.x * origin.x + normal.y * origin.y + normal.z * origin.z);
        return result;
    };
    BABYLON.Plane.SignedDistanceToPlaneFromPositionAndNormal = function (origin, normal, point) {
        var d = -(normal.x * origin.x + normal.y * origin.y + normal.z * origin.z);
        return BABYLON.Vector3.Dot(point, normal) + d;
    };
    BABYLON.Frustum = {};
    BABYLON.Frustum.GetPlanes = function (transform) {
        var frustumPlanes = [];
        for (var index = 0; index < 6; index++) {
            frustumPlanes.push(new BABYLON.Plane(0, 0, 0, 0));
        }
        BABYLON.Frustum.GetPlanesToRef(transform, frustumPlanes);
        return frustumPlanes;
    };
    BABYLON.Frustum.GetPlanesToRef = function (transform, frustumPlanes) {
        frustumPlanes[0].normal.x = transform.m[3] + transform.m[2];
        frustumPlanes[0].normal.y = transform.m[7] + transform.m[6];
        frustumPlanes[0].normal.z = transform.m[10] + transform.m[10];
        frustumPlanes[0].d = transform.m[15] + transform.m[14];
        frustumPlanes[0].normalize();
        frustumPlanes[1].normal.x = transform.m[3] - transform.m[2];
        frustumPlanes[1].normal.y = transform.m[7] - transform.m[6];
        frustumPlanes[1].normal.z = transform.m[11] - transform.m[10];
        frustumPlanes[1].d = transform.m[15] - transform.m[14];
        frustumPlanes[1].normalize();
        frustumPlanes[2].normal.x = transform.m[3] + transform.m[0];
        frustumPlanes[2].normal.y = transform.m[7] + transform.m[4];
        frustumPlanes[2].normal.z = transform.m[11] + transform.m[8];
        frustumPlanes[2].d = transform.m[15] + transform.m[12];
        frustumPlanes[2].normalize();
        frustumPlanes[3].normal.x = transform.m[3] - transform.m[0];
        frustumPlanes[3].normal.y = transform.m[7] - transform.m[4];
        frustumPlanes[3].normal.z = transform.m[11] - transform.m[8];
        frustumPlanes[3].d = transform.m[15] - transform.m[12];
        frustumPlanes[3].normalize();
        frustumPlanes[4].normal.x = transform.m[3] - transform.m[1];
        frustumPlanes[4].normal.y = transform.m[7] - transform.m[5];
        frustumPlanes[4].normal.z = transform.m[11] - transform.m[9];
        frustumPlanes[4].d = transform.m[15] - transform.m[13];
        frustumPlanes[4].normalize();
        frustumPlanes[5].normal.x = transform.m[3] + transform.m[1];
        frustumPlanes[5].normal.y = transform.m[7] + transform.m[5];
        frustumPlanes[5].normal.z = transform.m[11] + transform.m[9];
        frustumPlanes[5].d = transform.m[15] + transform.m[13];
        frustumPlanes[5].normalize();
    };
    BABYLON.Viewport = {};
    BABYLON.Viewport = function (x, y, width, height) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    };
    BABYLON.Viewport.prototype.toGlobal = function (engine) {
        var width = engine.getRenderWidth() * engine.getHardwareScalingLevel();
        var height = engine.getRenderHeight() * engine.getHardwareScalingLevel();
        return new BABYLON.Viewport(this.x * width, this.y * height, this.width * width, this.height * height);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Tools = BABYLON.Tools || {};
    BABYLON.Tools.GetFilename = function (path) {
        var index = path.lastIndexOf("/");
        if (index < 0) return path;
        return path.substring(index + 1);
    };
    BABYLON.Tools.GetDOMTextContent = function (element) {
        var result = "";
        var child = element.firstChild;
        while (child) {
            if (child.nodeType == 3) {
                result += child.textContent;
            }
            child = child.nextSibling;
        }
        return result;
    };
    BABYLON.Tools.ToDegrees = function (angle) {
        return angle * 180 / Math.PI;
    };
    BABYLON.Tools.ToRadians = function (angle) {
        return angle * Math.PI / 180;
    };
    BABYLON.Tools.ExtractMinAndMax = function (positions, start, count) {
        var minimum = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        var maximum = new BABYLON.Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        for (var index = start; index < start + count; index++) {
            var current = new BABYLON.Vector3(positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2]);
            minimum = BABYLON.Vector3.Minimize(current, minimum);
            maximum = BABYLON.Vector3.Maximize(current, maximum);
        }
        return {
            minimum: minimum,
            maximum: maximum
        };
    };
    BABYLON.Tools.SmartArray = function (capacity) {
        this.data = new Array(capacity);
        this.length = 0;
    };
    BABYLON.Tools.SmartArray.prototype.push = function (value) {
        this.data[this.length++] = value;
        if (this.length > this.data.length) {
            this.data.length *= 2;
        }
    };
    BABYLON.Tools.SmartArray.prototype.pushNoDuplicate = function (value) {
        if (this.indexOf(value) > -1) {
            return;
        }
        this.push(value);
    };
    BABYLON.Tools.SmartArray.prototype.sort = function (compareFn) {
        this.data.sort(compareFn);
    };
    BABYLON.Tools.SmartArray.prototype.reset = function () {
        this.length = 0;
    };
    BABYLON.Tools.SmartArray.prototype.concat = function (array) {
        if (array.length === 0) {
            return;
        }
        if (this.length + array.length > this.data.length) {
            this.data.length = (this.length + array.length) * 2;
        }
        for (var index = 0; index < array.length; index++) {
            this.data[this.length++] = (array.data || array)[index];
        }
    };
    BABYLON.Tools.SmartArray.prototype.concatWithNoDuplicate = function (array) {
        if (array.length === 0) {
            return;
        }
        if (this.length + array.length > this.data.length) {
            this.data.length = (this.length + array.length) * 2;
        }
        for (var index = 0; index < array.length; index++) {
            var item = (array.data || array)[index];
            var pos = this.data.indexOf(item);
            if (pos === -1 || pos >= this.length) {
                this.data[this.length++] = item;
            }
        }
    };
    BABYLON.Tools.SmartArray.prototype.indexOf = function (value) {
        var position = this.data.indexOf(value);
        if (position >= this.length) {
            return -1;
        }
        return position;
    };
    BABYLON.Tools.GetPointerPrefix = function () {
        var eventPrefix = "pointer";
        if (!navigator.pointerEnabled) {
            eventPrefix = "mouse";
        }
        return eventPrefix;
    };
    BABYLON.Tools.QueueNewFrame = function (func) {
        if (window.requestAnimationFrame) window.requestAnimationFrame(func);
        else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(func);
        else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(func);
        else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(func);
        else if (window.oRequestAnimationFrame) window.oRequestAnimationFrame(func);
        else {
            window.setTimeout(func, 16);
        }
    };
    BABYLON.Tools.RequestFullscreen = function (element) {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
    };
    BABYLON.Tools.ExitFullscreen = function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msCancelFullScreen) {
            document.msCancelFullScreen();
        }
    };
    BABYLON.Tools.BaseUrl = "";
    BABYLON.Tools.LoadImage = function (url, onload, onerror, database) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            onload(img);
        };
        img.onerror = function (err) {
            onerror(img, err);
        };
        var noIndexedDB = function () {
            img.src = url;
        };
        var loadFromIndexedDB = function () {
            database.loadImageFromDB(url, img);
        };
        if (database && database.enableTexturesOffline && BABYLON.Database.isUASupportingBlobStorage) {
            database.openAsync(loadFromIndexedDB, noIndexedDB);
        } else {
            if (url.indexOf("file:") === -1) {
                noIndexedDB();
            } else {
                try {
                    var textureName = url.substring(5);
                    var blobURL;
                    try {
                        blobURL = URL.createObjectURL(BABYLON.FilesTextures[textureName], {
                            oneTimeOnly: true
                        });
                    } catch (ex) {
                        blobURL = URL.createObjectURL(BABYLON.FilesTextures[textureName]);
                    }
                    img.src = blobURL;
                } catch (e) {
                    console.log("Error while trying to load texture: " + textureName);
                    img.src = null;
                }
            }
        }
        return img;
    };
    BABYLON.Tools.LoadFile = function (url, callback, progressCallBack, database, useArrayBuffer) {
        var noIndexedDB = function () {
            var request = new XMLHttpRequest();
            var loadUrl = BABYLON.Tools.BaseUrl + url;
            request.open('GET', loadUrl, true);
            if (useArrayBuffer) {
                request.responseType = "arraybuffer";
            }
            request.onprogress = progressCallBack;
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        callback(!useArrayBuffer ? request.responseText : request.response);
                    } else {
                        throw new Error(request.status, "Unable to load " + loadUrl);
                    }
                }
            };
            request.send(null);
        };
        var loadFromIndexedDB = function () {
            database.loadSceneFromDB(url, callback, progressCallBack, noIndexedDB);
        };
        if (database && url.indexOf(".babylon") !== -1 && (database.enableSceneOffline)) {
            database.openAsync(loadFromIndexedDB, noIndexedDB);
        } else {
            noIndexedDB();
        }
    };
    BABYLON.Tools.ReadFile = function (fileToLoad, callback, progressCallBack) {
        var reader = new FileReader();
        reader.onload = function (e) {
            callback(e.target.result);
        };
        reader.onprogress = progressCallBack;
        reader.readAsText(fileToLoad);
    };
    BABYLON.Tools.WithinEpsilon = function (a, b) {
        var num = a - b;
        return -1.401298E-45 <= num && num <= 1.401298E-45;
    };
    var cloneValue = function (source, destinationObject) {
        if (!source) return null;
        if (source instanceof BABYLON.Mesh) {
            return null;
        }
        if (source instanceof BABYLON.SubMesh) {
            return source.clone(destinationObject);
        } else if (source.clone) {
            return source.clone();
        }
        return null;
    };
    BABYLON.Tools.DeepCopy = function (source, destination, doNotCopyList, mustCopyList) {
        for (var prop in source) {
            if (prop[0] === "_" && (!mustCopyList || mustCopyList.indexOf(prop) === -1)) {
                continue;
            }
            if (doNotCopyList && doNotCopyList.indexOf(prop) !== -1) {
                continue;
            }
            var sourceValue = source[prop];
            var typeOfSourceValue = typeof sourceValue;
            if (typeOfSourceValue == "function") {
                continue;
            }
            if (typeOfSourceValue == "object") {
                if (sourceValue instanceof Array) {
                    destination[prop] = [];
                    if (sourceValue.length > 0) {
                        if (typeof sourceValue[0] == "object") {
                            for (var index = 0; index < sourceValue.length; index++) {
                                var clonedValue = cloneValue(sourceValue[index], destination);
                                if (destination[prop].indexOf(clonedValue) === -1) {
                                    destination[prop].push(clonedValue);
                                }
                            }
                        } else {
                            destination[prop] = sourceValue.slice(0);
                        }
                    }
                } else {
                    destination[prop] = cloneValue(sourceValue, destination);
                }
            } else {
                destination[prop] = sourceValue;
            }
        }
    };
    var fpsRange = 60;
    var previousFramesDuration = [];
    var fps = 60;
    var deltaTime = 0;
    BABYLON.Tools.GetFps = function () {
        return fps;
    };
    BABYLON.Tools.GetDeltaTime = function () {
        return deltaTime;
    };
    BABYLON.Tools._MeasureFps = function () {
        previousFramesDuration.push((new Date).getTime());
        var length = previousFramesDuration.length;
        if (length >= 2) {
            deltaTime = previousFramesDuration[length - 1] - previousFramesDuration[length - 2];
        }
        if (length >= fpsRange) {
            if (length > fpsRange) {
                previousFramesDuration.splice(0, 1);
                length = previousFramesDuration.length;
            }
            var sum = 0;
            for (var id = 0; id < length - 1; id++) {
                sum += previousFramesDuration[id + 1] - previousFramesDuration[id];
            }
            fps = 1000.0 / (sum / (length - 1));
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Engine = function (canvas, antialias, options) {
        var that = this;
        this._renderingCanvas = canvas;
        options = options || {};
        options.antialias = antialias;
        try {
            this._gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
        } catch (e) {
            throw new Error("WebGL not supported");
        }
        if (!this._gl) {
            throw new Error("WebGL not supported");
        }
        this._windowIsBackground = false;
        this._onBlur = function () {
            that._windowIsBackground = true;
        };
        this._onFocus = function () {
            that._windowIsBackground = false;
        };
        window.addEventListener("blur", this._onBlur);
        window.addEventListener("focus", this._onFocus);
        this.forceWireframe = false;
        this.cullBackFaces = true;
        this.renderEvenInBackground = true;
        this.scenes = [];
        this._workingCanvas = document.createElement("canvas");
        this._workingContext = this._workingCanvas.getContext("2d");
        this._hardwareScalingLevel = 1.0 / (window.devicePixelRatio || 1.0);
        this.resize();
        this._caps = {};
        this._caps.maxTexturesImageUnits = this._gl.getParameter(this._gl.MAX_TEXTURE_IMAGE_UNITS);
        this._caps.maxTextureSize = this._gl.getParameter(this._gl.MAX_TEXTURE_SIZE);
        this._caps.maxCubemapTextureSize = this._gl.getParameter(this._gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        this._caps.maxRenderTextureSize = this._gl.getParameter(this._gl.MAX_RENDERBUFFER_SIZE);
        this._caps.standardDerivatives = (this._gl.getExtension('OES_standard_derivatives') !== null);
        this._caps.s3tc = this._gl.getExtension('WEBGL_compressed_texture_s3tc');
        this._caps.textureFloat = (this._gl.getExtension('OES_texture_float') !== null);
        this._caps.textureAnisotropicFilterExtension = this._gl.getExtension('EXT_texture_filter_anisotropic') || this._gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || this._gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
        this._caps.maxAnisotropy = this._caps.textureAnisotropicFilterExtension ? this._gl.getParameter(this._caps.textureAnisotropicFilterExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
        this._loadedTexturesCache = [];
        this._activeTexturesCache = [];
        this._currentEffect = null;
        this._currentState = {
            culling: null
        };
        this._compiledEffects = {};
        this._gl.enable(this._gl.DEPTH_TEST);
        this._gl.depthFunc(this._gl.LEQUAL);
        this.isFullscreen = false;
        this._onFullscreenChange = function () {
            if (document.fullscreen !== undefined) {
                that.isFullscreen = document.fullscreen;
            } else if (document.mozFullScreen !== undefined) {
                that.isFullscreen = document.mozFullScreen;
            } else if (document.webkitIsFullScreen !== undefined) {
                that.isFullscreen = document.webkitIsFullScreen;
            } else if (document.msIsFullScreen !== undefined) {
                that.isFullscreen = document.msIsFullScreen;
            }
            if (that.isFullscreen && that._pointerLockRequested) {
                canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
                if (canvas.requestPointerLock) {
                    canvas.requestPointerLock();
                }
            }
        };
        document.addEventListener("fullscreenchange", this._onFullscreenChange, false);
        document.addEventListener("mozfullscreenchange", this._onFullscreenChange, false);
        document.addEventListener("webkitfullscreenchange", this._onFullscreenChange, false);
        document.addEventListener("msfullscreenchange", this._onFullscreenChange, false);
        this.isPointerLock = false;
        this._onPointerLockChange = function () {
            that.isPointerLock = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
        };
        document.addEventListener("pointerlockchange", this._onPointerLockChange, false);
        document.addEventListener("mspointerlockchange", this._onPointerLockChange, false);
        document.addEventListener("mozpointerlockchange", this._onPointerLockChange, false);
        document.addEventListener("webkitpointerlockchange", this._onPointerLockChange, false);
    };
    BABYLON.Engine.prototype.getAspectRatio = function (camera) {
        var viewport = camera.viewport;
        return (this._renderingCanvas.width * viewport.width) / (this._renderingCanvas.height * viewport.height);
    };
    BABYLON.Engine.prototype.getRenderWidth = function () {
        return this._renderingCanvas.width;
    };
    BABYLON.Engine.prototype.getRenderHeight = function () {
        return this._renderingCanvas.height;
    };
    BABYLON.Engine.prototype.getRenderingCanvas = function () {
        return this._renderingCanvas;
    };
    BABYLON.Engine.prototype.setHardwareScalingLevel = function (level) {
        this._hardwareScalingLevel = level;
        this.resize();
    };
    BABYLON.Engine.prototype.getHardwareScalingLevel = function () {
        return this._hardwareScalingLevel;
    };
    BABYLON.Engine.prototype.getLoadedTexturesCache = function () {
        return this._loadedTexturesCache;
    };
    BABYLON.Engine.prototype.getCaps = function () {
        return this._caps;
    };
    BABYLON.Engine.prototype.stopRenderLoop = function () {
        this._renderFunction = null;
        this._runningLoop = false;
    };
    BABYLON.Engine.prototype._renderLoop = function () {
        var shouldRender = true;
        if (!this.renderEvenInBackground && this._windowIsBackground) {
            shouldRender = false;
        }
        if (shouldRender) {
            this.beginFrame();
            if (this._renderFunction) {
                this._renderFunction();
            }
            this.endFrame();
        }
        if (this._runningLoop) {
            var that = this;
            BABYLON.Tools.QueueNewFrame(function () {
                that._renderLoop();
            });
        }
    };
    BABYLON.Engine.prototype.runRenderLoop = function (renderFunction) {
        this._runningLoop = true;
        this._renderFunction = renderFunction;
        var that = this;
        BABYLON.Tools.QueueNewFrame(function () {
            that._renderLoop();
        });
    };
    BABYLON.Engine.prototype.switchFullscreen = function (requestPointerLock) {
        if (this.isFullscreen) {
            BABYLON.Tools.ExitFullscreen();
        } else {
            this._pointerLockRequested = requestPointerLock;
            BABYLON.Tools.RequestFullscreen(this._renderingCanvas);
        }
    };
    BABYLON.Engine.prototype.clear = function (color, backBuffer, depthStencil) {
        this._gl.clearColor(color.r, color.g, color.b, color.a !== undefined ? color.a : 1.0);
        this._gl.clearDepth(1.0);
        var mode = 0;
        if (backBuffer) mode |= this._gl.COLOR_BUFFER_BIT;
        if (depthStencil) mode |= this._gl.DEPTH_BUFFER_BIT;
        this._gl.clear(mode);
    };
    BABYLON.Engine.prototype.setViewport = function (viewport, requiredWidth, requiredHeight) {
        var width = requiredWidth || this._renderingCanvas.width;
        var height = requiredHeight || this._renderingCanvas.height;
        var x = viewport.x || 0;
        var y = viewport.y || 0;
        this._cachedViewport = viewport;
        this._gl.viewport(x * width, y * height, width * viewport.width, height * viewport.height);
    };
    BABYLON.Engine.prototype.setDirectViewport = function (x, y, width, height) {
        this._cachedViewport = null;
        this._gl.viewport(x, y, width, height);
    };
    BABYLON.Engine.prototype.beginFrame = function () {
        BABYLON.Tools._MeasureFps();
    };
    BABYLON.Engine.prototype.endFrame = function () {
        this.flushFramebuffer();
    };
    BABYLON.Engine.prototype.resize = function () {
        this._renderingCanvas.width = this._renderingCanvas.clientWidth / this._hardwareScalingLevel;
        this._renderingCanvas.height = this._renderingCanvas.clientHeight / this._hardwareScalingLevel;
    };
    BABYLON.Engine.prototype.bindFramebuffer = function (texture) {
        var gl = this._gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, texture._framebuffer);
        this._gl.viewport(0, 0, texture._width, texture._height);
        this.wipeCaches();
    };
    BABYLON.Engine.prototype.unBindFramebuffer = function (texture) {
        if (texture.generateMipMaps) {
            var gl = this._gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    };
    BABYLON.Engine.prototype.flushFramebuffer = function () {
        this._gl.flush();
    };
    BABYLON.Engine.prototype.restoreDefaultFramebuffer = function () {
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
        this.setViewport(this._cachedViewport);
        this.wipeCaches();
    };
    BABYLON.Engine.prototype.createVertexBuffer = function (vertices) {
        var vbo = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vbo);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
        vbo.references = 1;
        return vbo;
    };
    BABYLON.Engine.prototype.createDynamicVertexBuffer = function (capacity) {
        var vbo = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vbo);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, capacity, this._gl.DYNAMIC_DRAW);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
        vbo.references = 1;
        return vbo;
    };
    BABYLON.Engine.prototype.updateDynamicVertexBuffer = function (vertexBuffer, vertices, length) {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer);
        if (length) {
            this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, new Float32Array(vertices, 0, length));
        } else {
            this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
        }
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
    };
    BABYLON.Engine.prototype.createIndexBuffer = function (indices) {
        var vbo = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, vbo);
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this._gl.STATIC_DRAW);
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null);
        vbo.references = 1;
        return vbo;
    };
    BABYLON.Engine.prototype.bindBuffers = function (vertexBuffer, indexBuffer, vertexDeclaration, vertexStrideSize, effect) {
        if (this._cachedVertexBuffers !== vertexBuffer || this._cachedEffectForVertexBuffers !== effect) {
            this._cachedVertexBuffers = vertexBuffer;
            this._cachedEffectForVertexBuffers = effect;
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer);
            var offset = 0;
            for (var index = 0; index < vertexDeclaration.length; index++) {
                var order = effect.getAttribute(index);
                if (order >= 0) {
                    this._gl.vertexAttribPointer(order, vertexDeclaration[index], this._gl.FLOAT, false, vertexStrideSize, offset);
                }
                offset += vertexDeclaration[index] * 4;
            }
        }
        if (this._cachedIndexBuffer !== indexBuffer) {
            this._cachedIndexBuffer = indexBuffer;
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        }
    };
    BABYLON.Engine.prototype.bindMultiBuffers = function (vertexBuffers, indexBuffer, effect) {
        if (this._cachedVertexBuffers !== vertexBuffers || this._cachedEffectForVertexBuffers !== effect) {
            this._cachedVertexBuffers = vertexBuffers;
            this._cachedEffectForVertexBuffers = effect;
            var attributes = effect.getAttributesNames();
            for (var index = 0; index < attributes.length; index++) {
                var order = effect.getAttribute(index);
                if (order >= 0) {
                    var vertexBuffer = vertexBuffers[attributes[index]];
                    var stride = vertexBuffer.getStrideSize();
                    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer._buffer);
                    this._gl.vertexAttribPointer(order, stride, this._gl.FLOAT, false, stride * 4, 0);
                }
            }
        }
        if (this._cachedIndexBuffer !== indexBuffer) {
            this._cachedIndexBuffer = indexBuffer;
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        }
    };
    BABYLON.Engine.prototype._releaseBuffer = function (buffer) {
        buffer.references--;
        if (buffer.references === 0) {
            this._gl.deleteBuffer(buffer);
        }
    };
    BABYLON.Engine.prototype.draw = function (useTriangles, indexStart, indexCount) {
        this._gl.drawElements(useTriangles ? this._gl.TRIANGLES : this._gl.LINES, indexCount, this._gl.UNSIGNED_SHORT, indexStart * 2);
    };
    BABYLON.Engine.prototype.createEffect = function (baseName, attributesNames, uniformsNames, samplers, defines, optionalDefines) {
        var vertex = baseName.vertexElement || baseName.vertex || baseName;
        var fragment = baseName.fragmentElement || baseName.fragment || baseName;
        var name = vertex + "+" + fragment + "@" + defines;
        if (this._compiledEffects[name]) {
            return this._compiledEffects[name];
        }
        var effect = new BABYLON.Effect(baseName, attributesNames, uniformsNames, samplers, this, defines, optionalDefines);
        this._compiledEffects[name] = effect;
        return effect;
    };
    var compileShader = function (gl, source, type, defines) {
        var shader = gl.createShader(type === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
        gl.shaderSource(shader, (defines ? defines + "\n" : "") + source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }
        return shader;
    };
    BABYLON.Engine.prototype.createShaderProgram = function (vertexCode, fragmentCode, defines) {
        var vertexShader = compileShader(this._gl, vertexCode, "vertex", defines);
        var fragmentShader = compileShader(this._gl, fragmentCode, "fragment", defines);
        var shaderProgram = this._gl.createProgram();
        this._gl.attachShader(shaderProgram, vertexShader);
        this._gl.attachShader(shaderProgram, fragmentShader);
        this._gl.linkProgram(shaderProgram);
        var error = this._gl.getProgramInfoLog(shaderProgram);
        if (error) {
            throw new Error(error);
        }
        this._gl.deleteShader(vertexShader);
        this._gl.deleteShader(fragmentShader);
        return shaderProgram;
    };
    BABYLON.Engine.prototype.getUniforms = function (shaderProgram, uniformsNames) {
        var results = [];
        for (var index = 0; index < uniformsNames.length; index++) {
            results.push(this._gl.getUniformLocation(shaderProgram, uniformsNames[index]));
        }
        return results;
    };
    BABYLON.Engine.prototype.getAttributes = function (shaderProgram, attributesNames) {
        var results = [];
        for (var index = 0; index < attributesNames.length; index++) {
            try {
                results.push(this._gl.getAttribLocation(shaderProgram, attributesNames[index]));
            } catch (e) {
                results.push(-1);
            }
        }
        return results;
    };
    BABYLON.Engine.prototype.enableEffect = function (effect) {
        if (!effect || !effect.getAttributesCount() || this._currentEffect === effect) {
            return;
        }
        this._gl.useProgram(effect.getProgram());
        for (var index = 0; index < effect.getAttributesCount(); index++) {
            var order = effect.getAttribute(index);
            if (order >= 0) {
                this._gl.enableVertexAttribArray(effect.getAttribute(index));
            }
        }
        this._currentEffect = effect;
    };
    BABYLON.Engine.prototype.setArray = function (uniform, array) {
        if (!uniform) return;
        this._gl.uniform1fv(uniform, array);
    };
    BABYLON.Engine.prototype.setMatrices = function (uniform, matrices) {
        if (!uniform) return;
        this._gl.uniformMatrix4fv(uniform, false, matrices);
    };
    BABYLON.Engine.prototype.setMatrix = function (uniform, matrix) {
        if (!uniform) return;
        this._gl.uniformMatrix4fv(uniform, false, matrix.toArray());
    };
    BABYLON.Engine.prototype.setFloat = function (uniform, value) {
        if (!uniform) return;
        this._gl.uniform1f(uniform, value);
    };
    BABYLON.Engine.prototype.setFloat2 = function (uniform, x, y) {
        if (!uniform) return;
        this._gl.uniform2f(uniform, x, y);
    };
    BABYLON.Engine.prototype.setFloat3 = function (uniform, x, y, z) {
        if (!uniform) return;
        this._gl.uniform3f(uniform, x, y, z);
    };
    BABYLON.Engine.prototype.setBool = function (uniform, bool) {
        if (!uniform) return;
        this._gl.uniform1i(uniform, bool);
    };
    BABYLON.Engine.prototype.setFloat4 = function (uniform, x, y, z, w) {
        if (!uniform) return;
        this._gl.uniform4f(uniform, x, y, z, w);
    };
    BABYLON.Engine.prototype.setColor3 = function (uniform, color3) {
        if (!uniform) return;
        this._gl.uniform3f(uniform, color3.r, color3.g, color3.b);
    };
    BABYLON.Engine.prototype.setColor4 = function (uniform, color3, alpha) {
        if (!uniform) return;
        this._gl.uniform4f(uniform, color3.r, color3.g, color3.b, alpha);
    };
    BABYLON.Engine.prototype.setState = function (culling) {
        if (this._currentState.culling !== culling) {
            if (culling) {
                this._gl.cullFace(this.cullBackFaces ? this._gl.BACK : this._gl.FRONT);
                this._gl.enable(this._gl.CULL_FACE);
            } else {
                this._gl.disable(this._gl.CULL_FACE);
            }
            this._currentState.culling = culling;
        }
    };
    BABYLON.Engine.prototype.setDepthBuffer = function (enable) {
        if (enable) {
            this._gl.enable(this._gl.DEPTH_TEST);
        } else {
            this._gl.disable(this._gl.DEPTH_TEST);
        }
    };
    BABYLON.Engine.prototype.setDepthWrite = function (enable) {
        this._gl.depthMask(enable);
    };
    BABYLON.Engine.prototype.setColorWrite = function (enable) {
        this._gl.colorMask(enable, enable, enable, enable);
    };
    BABYLON.Engine.prototype.setAlphaMode = function (mode) {
        switch (mode) {
        case BABYLON.Engine.ALPHA_DISABLE:
            this.setDepthWrite(true);
            this._gl.disable(this._gl.BLEND);
            break;
        case BABYLON.Engine.ALPHA_COMBINE:
            this.setDepthWrite(false);
            this._gl.blendFuncSeparate(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE);
            this._gl.enable(this._gl.BLEND);
            break;
        case BABYLON.Engine.ALPHA_ADD:
            this.setDepthWrite(false);
            this._gl.blendFuncSeparate(this._gl.ONE, this._gl.ONE, this._gl.ZERO, this._gl.ONE);
            this._gl.enable(this._gl.BLEND);
            break;
        }
    };
    BABYLON.Engine.prototype.setAlphaTesting = function (enable) {
        this._alphaTest = enable;
    };
    BABYLON.Engine.prototype.getAlphaTesting = function () {
        return this._alphaTest;
    };
    BABYLON.Engine.prototype.wipeCaches = function () {
        this._activeTexturesCache = [];
        this._currentEffect = null;
        this._currentState = {
            culling: null
        };
        this._cachedVertexBuffers = null;
        this._cachedVertexBuffers = null;
        this._cachedEffectForVertexBuffers = null;
    };
    var getExponantOfTwo = function (value, max) {
        var count = 1;
        do {
            count *= 2;
        } while (count < value);
        if (count > max) count = max;
        return count;
    };
    var prepareWebGLTexture = function (texture, scene, width, height, invertY, noMipmap, processFunction) {
        var engine = scene.getEngine();
        var potWidth = getExponantOfTwo(width, engine._caps.maxTextureSize);
        var potHeight = getExponantOfTwo(height, engine._caps.maxTextureSize);
        engine._gl.bindTexture(engine._gl.TEXTURE_2D, texture);
        engine._gl.pixelStorei(engine._gl.UNPACK_FLIP_Y_WEBGL, invertY === undefined ? true : invertY);
        processFunction(potWidth, potHeight);
        engine._gl.texParameteri(engine._gl.TEXTURE_2D, engine._gl.TEXTURE_MAG_FILTER, engine._gl.LINEAR);
        if (noMipmap) {
            engine._gl.texParameteri(engine._gl.TEXTURE_2D, engine._gl.TEXTURE_MIN_FILTER, engine._gl.LINEAR);
        } else {
            engine._gl.texParameteri(engine._gl.TEXTURE_2D, engine._gl.TEXTURE_MIN_FILTER, engine._gl.LINEAR_MIPMAP_LINEAR);
            engine._gl.generateMipmap(engine._gl.TEXTURE_2D);
        }
        engine._gl.bindTexture(engine._gl.TEXTURE_2D, null);
        engine._activeTexturesCache = [];
        texture._baseWidth = width;
        texture._baseHeight = height;
        texture._width = potWidth;
        texture._height = potHeight;
        texture.isReady = true;
        scene._removePendingData(texture);
    };
    BABYLON.Engine.prototype.createTexture = function (url, noMipmap, invertY, scene) {
        var texture = this._gl.createTexture();
        var that = this;
        var isDDS = this.getCaps().s3tc && (url.substr(url.length - 4, 4).toLowerCase() === ".dds");
        scene._addPendingData(texture);
        texture.url = url;
        texture.noMipmap = noMipmap;
        texture.references = 1;
        this._loadedTexturesCache.push(texture);
        if (isDDS) {
            BABYLON.Tools.LoadFile(url, function (data) {
                var info = BABYLON.Tools.GetDDSInfo(data);
                var loadMipmap = info.mipmapCount > 1 && !noMipmap;
                prepareWebGLTexture(texture, scene, info.width, info.height, invertY, !loadMipmap, function (potWidth, potHeight) {
                    BABYLON.Tools.UploadDDSLevels(that._gl, that.getCaps().s3tc, data, loadMipmap);
                });
            }, null, scene.database, true);
        } else {
            var onload = function (img) {
                prepareWebGLTexture(texture, scene, img.width, img.height, invertY, noMipmap, function (potWidth, potHeight) {
                    var isPot = (img.width == potWidth && img.height == potHeight);
                    if (!isPot) {
                        that._workingCanvas.width = potWidth;
                        that._workingCanvas.height = potHeight;
                        that._workingContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, potWidth, potHeight);
                    }
                    that._gl.texImage2D(that._gl.TEXTURE_2D, 0, that._gl.RGBA, that._gl.RGBA, that._gl.UNSIGNED_BYTE, isPot ? img : that._workingCanvas);
                });
            };
            var onerror = function () {
                scene._removePendingData(texture);
            };
            BABYLON.Tools.LoadImage(url, onload, onerror, scene.database);
        }
        return texture;
    };
    BABYLON.Engine.prototype.createDynamicTexture = function (width, height, generateMipMaps) {
        var texture = this._gl.createTexture();
        width = getExponantOfTwo(width, this._caps.maxTextureSize);
        height = getExponantOfTwo(height, this._caps.maxTextureSize);
        this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
        if (!generateMipMaps) {
            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
        } else {
            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR_MIPMAP_LINEAR);
        }
        this._gl.bindTexture(this._gl.TEXTURE_2D, null);
        this._activeTexturesCache = [];
        texture._baseWidth = width;
        texture._baseHeight = height;
        texture._width = width;
        texture._height = height;
        texture.isReady = false;
        texture.generateMipMaps = generateMipMaps;
        texture.references = 1;
        this._loadedTexturesCache.push(texture);
        return texture;
    };
    BABYLON.Engine.prototype.updateDynamicTexture = function (texture, canvas, invertY) {
        this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, invertY);
        this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, canvas);
        if (texture.generateMipMaps) {
            this._gl.generateMipmap(this._gl.TEXTURE_2D);
        }
        this._gl.bindTexture(this._gl.TEXTURE_2D, null);
        this._activeTexturesCache = [];
        texture.isReady = true;
    };
    BABYLON.Engine.prototype.updateVideoTexture = function (texture, video, invertY) {
        this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, invertY ? false : true);
        if (video.videoWidth !== texture._width || video.videoHeight !== texture._height) {
            if (!texture._workingCanvas) {
                texture._workingCanvas = document.createElement("canvas");
                texture._workingContext = texture._workingCanvas.getContext("2d");
                texture._workingCanvas.width = texture._width;
                texture._workingCanvas.height = texture._height;
            }
            texture._workingContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, texture._width, texture._height);
            this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, texture._workingCanvas);
        } else {
            this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, video);
        } if (texture.generateMipMaps) {
            this._gl.generateMipmap(this._gl.TEXTURE_2D);
        }
        this._gl.bindTexture(this._gl.TEXTURE_2D, null);
        this._activeTexturesCache = [];
        texture.isReady = true;
    };
    BABYLON.Engine.prototype.createRenderTargetTexture = function (size, options) {
        var generateMipMaps = false;
        var generateDepthBuffer = true;
        var samplingMode = BABYLON.Texture.TRILINEAR_SAMPLINGMODE;
        if (options !== undefined) {
            generateMipMaps = options.generateMipMaps === undefined ? options : options.generateMipmaps;
            generateDepthBuffer = options.generateDepthBuffer === undefined ? true : options.generateDepthBuffer;
            if (options.samplingMode !== undefined) {
                samplingMode = options.samplingMode;
            }
        }
        var gl = this._gl;
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        var width = size.width || size;
        var height = size.height || size;
        var magFilter = gl.NEAREST;
        var minFilter = gl.NEAREST;
        if (samplingMode === BABYLON.Texture.BILINEAR_SAMPLINGMODE) {
            magFilter = gl.LINEAR;
            if (generateMipMaps) {
                minFilter = gl.LINEAR_MIPMAP_NEAREST;
            } else {
                minFilter = gl.LINEAR;
            }
        } else if (samplingMode === BABYLON.Texture.TRILINEAR_SAMPLINGMODE) {
            magFilter = gl.LINEAR;
            if (generateMipMaps) {
                minFilter = gl.LINEAR_MIPMAP_LINEAR;
            } else {
                minFilter = gl.LINEAR;
            }
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        var depthBuffer;
        if (generateDepthBuffer) {
            depthBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        }
        var framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        if (generateDepthBuffer) {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        texture._framebuffer = framebuffer;
        if (generateDepthBuffer) {
            texture._depthBuffer = depthBuffer;
        }
        texture._width = width;
        texture._height = height;
        texture.isReady = true;
        texture.generateMipMaps = generateMipMaps;
        texture.references = 1;
        this._activeTexturesCache = [];
        this._loadedTexturesCache.push(texture);
        return texture;
    };
    var cascadeLoad = function (rootUrl, index, loadedImages, scene, onfinish, extensions) {
        var img;
        var onload = function () {
            loadedImages.push(img);
            scene._removePendingData(img);
            if (index != extensions.length - 1) {
                cascadeLoad(rootUrl, index + 1, loadedImages, scene, onfinish, extensions);
            } else {
                onfinish(loadedImages);
            }
        };
        var onerror = function () {
            scene._removePendingData(img);
        };
        img = BABYLON.Tools.LoadImage(rootUrl + extensions[index], onload, onerror, scene.database);
        scene._addPendingData(img);
    };
    BABYLON.Engine.prototype.createCubeTexture = function (rootUrl, scene, extensions, noMipmap) {
        var gl = this._gl;
        var texture = gl.createTexture();
        texture.isCube = true;
        texture.url = rootUrl;
        texture.references = 1;
        this._loadedTexturesCache.push(texture);
        var that = this;
        cascadeLoad(rootUrl, 0, [], scene, function (imgs) {
            var width = getExponantOfTwo(imgs[0].width, that._caps.maxCubemapTextureSize);
            var height = width;
            that._workingCanvas.width = width;
            that._workingCanvas.height = height;
            var faces = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            for (var index = 0; index < faces.length; index++) {
                that._workingContext.drawImage(imgs[index], 0, 0, imgs[index].width, imgs[index].height, 0, 0, width, height);
                gl.texImage2D(faces[index], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, that._workingCanvas);
            }
            if (!noMipmap) {
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, noMipmap ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            that._activeTexturesCache = [];
            texture._width = width;
            texture._height = height;
            texture.isReady = true;
        }, extensions);
        return texture;
    };
    BABYLON.Engine.prototype._releaseTexture = function (texture) {
        var gl = this._gl;
        if (texture._framebuffer) {
            gl.deleteFramebuffer(texture._framebuffer);
        }
        if (texture._depthBuffer) {
            gl.deleteRenderbuffer(texture._depthBuffer);
        }
        gl.deleteTexture(texture);
        for (var channel = 0; channel < this._caps.maxTexturesImageUnits; channel++) {
            this._gl.activeTexture(this._gl["TEXTURE" + channel]);
            this._gl.bindTexture(this._gl.TEXTURE_2D, null);
            this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
            this._activeTexturesCache[channel] = null;
        }
        var index = this._loadedTexturesCache.indexOf(texture);
        if (index !== -1) {
            this._loadedTexturesCache.splice(index, 1);
        }
    };
    BABYLON.Engine.prototype.bindSamplers = function (effect) {
        this._gl.useProgram(effect.getProgram());
        var samplers = effect.getSamplers();
        for (var index = 0; index < samplers.length; index++) {
            var uniform = effect.getUniform(samplers[index]);
            this._gl.uniform1i(uniform, index);
        }
        this._currentEffect = null;
    };
    BABYLON.Engine.prototype._bindTexture = function (channel, texture) {
        this._gl.activeTexture(this._gl["TEXTURE" + channel]);
        this._gl.bindTexture(this._gl.TEXTURE_2D, texture);
        this._activeTexturesCache[channel] = null;
    };
    BABYLON.Engine.prototype.setTextureFromPostProcess = function (channel, postProcess) {
        this._bindTexture(channel, postProcess._textures.data[postProcess._currentRenderTextureInd]);
    };
    BABYLON.Engine.prototype.setTexture = function (channel, texture) {
        if (channel < 0) {
            return;
        }
        if (!texture || !texture.isReady()) {
            if (this._activeTexturesCache[channel] != null) {
                this._gl.activeTexture(this._gl["TEXTURE" + channel]);
                this._gl.bindTexture(this._gl.TEXTURE_2D, null);
                this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
                this._activeTexturesCache[channel] = null;
            }
            return;
        }
        if (texture instanceof BABYLON.VideoTexture) {
            if (texture._update()) {
                this._activeTexturesCache[channel] = null;
            }
        } else if (texture.delayLoadState == BABYLON.Engine.DELAYLOADSTATE_NOTLOADED) {
            texture.delayLoad();
            return;
        }
        if (this._activeTexturesCache[channel] == texture) {
            return;
        }
        this._activeTexturesCache[channel] = texture;
        var internalTexture = texture.getInternalTexture();
        this._gl.activeTexture(this._gl["TEXTURE" + channel]);
        if (internalTexture.isCube) {
            this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, internalTexture);
            if (internalTexture._cachedCoordinatesMode !== texture.coordinatesMode) {
                internalTexture._cachedCoordinatesMode = texture.coordinatesMode;
                this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_WRAP_S, texture.coordinatesMode !== BABYLON.CubeTexture.CUBIC_MODE ? this._gl.REPEAT : this._gl.CLAMP_TO_EDGE);
                this._gl.texParameteri(this._gl.TEXTURE_CUBE_MAP, this._gl.TEXTURE_WRAP_T, texture.coordinatesMode !== BABYLON.CubeTexture.CUBIC_MODE ? this._gl.REPEAT : this._gl.CLAMP_TO_EDGE);
            }
            this._setAnisotropicLevel(this._gl.TEXTURE_CUBE_MAP, texture);
        } else {
            this._gl.bindTexture(this._gl.TEXTURE_2D, internalTexture);
            if (internalTexture._cachedWrapU !== texture.wrapU) {
                internalTexture._cachedWrapU = texture.wrapU;
                switch (texture.wrapU) {
                case BABYLON.Texture.WRAP_ADDRESSMODE:
                    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.REPEAT);
                    break;
                case BABYLON.Texture.CLAMP_ADDRESSMODE:
                    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
                    break;
                case BABYLON.Texture.MIRROR_ADDRESSMODE:
                    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.MIRRORED_REPEAT);
                    break;
                }
            }
            if (internalTexture._cachedWrapV !== texture.wrapV) {
                internalTexture._cachedWrapV = texture.wrapV;
                switch (texture.wrapV) {
                case BABYLON.Texture.WRAP_ADDRESSMODE:
                    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.REPEAT);
                    break;
                case BABYLON.Texture.CLAMP_ADDRESSMODE:
                    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
                    break;
                case BABYLON.Texture.MIRROR_ADDRESSMODE:
                    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.MIRRORED_REPEAT);
                    break;
                }
            }
            this._setAnisotropicLevel(this._gl.TEXTURE_2D, texture);
        }
    };
    BABYLON.Engine.prototype._setAnisotropicLevel = function (key, texture) {
        var anisotropicFilterExtension = this._caps.textureAnisotropicFilterExtension;
        if (anisotropicFilterExtension && texture._cachedAnisotropicFilteringLevel !== texture.anisotropicFilteringLevel) {
            this._gl.texParameterf(key, anisotropicFilterExtension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropicFilteringLevel, this._caps.maxAnisotropy));
            texture._cachedAnisotropicFilteringLevel = texture.anisotropicFilteringLevel;
        }
    };
    BABYLON.Engine.prototype.dispose = function () {
        while (this.scenes.length) {
            this.scenes[0].dispose();
        }
        for (var name in this._compiledEffects.length) {
            this._gl.deleteProgram(this._compiledEffects[name]._program);
        }
        window.removeEventListener("blur", this._onBlur);
        window.removeEventListener("focus", this._onFocus);
        document.removeEventListener("fullscreenchange", this._onFullscreenChange);
        document.removeEventListener("mozfullscreenchange", this._onFullscreenChange);
        document.removeEventListener("webkitfullscreenchange", this._onFullscreenChange);
        document.removeEventListener("msfullscreenchange", this._onFullscreenChange);
        document.removeEventListener("pointerlockchange", this._onPointerLockChange);
        document.removeEventListener("mspointerlockchange", this._onPointerLockChange);
        document.removeEventListener("mozpointerlockchange", this._onPointerLockChange);
        document.removeEventListener("webkitpointerlockchange", this._onPointerLockChange);
    };
    BABYLON.Engine.ShadersRepository = "Babylon/Shaders/";
    BABYLON.Engine.ALPHA_DISABLE = 0;
    BABYLON.Engine.ALPHA_ADD = 1;
    BABYLON.Engine.ALPHA_COMBINE = 2;
    BABYLON.Engine.DELAYLOADSTATE_NONE = 0;
    BABYLON.Engine.DELAYLOADSTATE_LOADED = 1;
    BABYLON.Engine.DELAYLOADSTATE_LOADING = 2;
    BABYLON.Engine.DELAYLOADSTATE_NOTLOADED = 4;
    BABYLON.Engine.epsilon = 0.001;
    BABYLON.Engine.collisionsEpsilon = 0.001;
    BABYLON.Engine.isSupported = function () {
        try {
            var tempcanvas = document.createElement("canvas");
            var gl = tempcanvas.getContext("webgl") || tempcanvas.getContext("experimental-webgl");
            return gl != null && !! window.WebGLRenderingContext;
        } catch (e) {
            return false;
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Node = function (scene) {
        this._scene = scene;
        BABYLON.Node.prototype._initCache.call(this);
    };
    BABYLON.Node.prototype.parent = null;
    BABYLON.Node.prototype._childrenFlag = -1;
    BABYLON.Node.prototype._isReady = true;
    BABYLON.Node.prototype._isEnabled = true;
    BABYLON.Node.prototype._currentRenderId = -1;
    BABYLON.Node.prototype._cache = null;
    BABYLON.Node.prototype._initCache = function () {
        this._cache = {};
        this._cache.parent = undefined;
    };
    BABYLON.Node.prototype.updateCache = function (force) {
        if (!force && this.isSynchronized()) return;
        this._cache.parent = this.parent;
        this._updateCache();
    };
    BABYLON.Node.prototype._updateCache = function (ignoreParentClass) {};
    BABYLON.Node.prototype._isSynchronized = function () {
        return true;
    };
    BABYLON.Node.prototype.isSynchronizedWithParent = function () {
        return this.parent ? !this.parent._currentRenderId === this._currentRenderId : true;
    };
    BABYLON.Node.prototype.isSynchronized = function (updateCache) {
        var check = this.hasNewParent();
        check = check || !this.isSynchronizedWithParent();
        check = check || !this._isSynchronized();
        if (updateCache) this.updateCache(true);
        return !check;
    };
    BABYLON.Node.prototype.hasNewParent = function (update) {
        if (this._cache.parent === this.parent) return false;
        if (update) this._cache.parent = this.parent;
        return true;
    };
    BABYLON.Node.prototype.isReady = function () {
        return this._isReady;
    };
    BABYLON.Node.prototype.isEnabled = function () {
        if (!this.isReady() || !this._isEnabled) {
            return false;
        }
        if (this.parent) {
            return this.parent.isEnabled();
        }
        return true;
    };
    BABYLON.Node.prototype.setEnabled = function (value) {
        this._isEnabled = value;
    };
    BABYLON.Node.prototype.isDescendantOf = function (ancestor) {
        if (this.parent) {
            if (this.parent === ancestor) {
                return true;
            }
            return this.parent.isDescendantOf(ancestor);
        }
        return false;
    };
    BABYLON.Node.prototype._getDescendants = function (list, results) {
        for (var index = 0; index < list.length; index++) {
            var item = list[index];
            if (item.isDescendantOf(this)) {
                results.push(item);
            }
        }
    };
    BABYLON.Node.prototype.getDescendants = function () {
        var results = [];
        this._getDescendants(this._scene.meshes, results);
        this._getDescendants(this._scene.lights, results);
        this._getDescendants(this._scene.cameras, results);
        return results;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.BoundingSphere = function (minimum, maximum) {
        this.minimum = minimum;
        this.maximum = maximum;
        var distance = BABYLON.Vector3.Distance(minimum, maximum);
        this.center = BABYLON.Vector3.Lerp(minimum, maximum, 0.5);;
        this.radius = distance * 0.5;
        this.centerWorld = BABYLON.Vector3.Zero();
        this._update(BABYLON.Matrix.Identity());
    };
    BABYLON.BoundingSphere.prototype._update = function (world, scale) {
        BABYLON.Vector3.TransformCoordinatesToRef(this.center, world, this.centerWorld);
        this.radiusWorld = this.radius * scale;
    };
    BABYLON.BoundingSphere.prototype.isInFrustum = function (frustumPlanes) {
        for (var i = 0; i < 6; i++) {
            if (frustumPlanes[i].dotCoordinate(this.centerWorld) <= -this.radiusWorld) return false;
        }
        return true;
    };
    BABYLON.BoundingSphere.prototype.intersectsPoint = function (point) {
        var x = this.centerWorld.x - point.x;
        var y = this.centerWorld.y - point.y;
        var z = this.centerWorld.z - point.z;
        var distance = Math.sqrt((x * x) + (y * y) + (z * z));
        if (this.radiusWorld < distance) return false;
        return true;
    };
    BABYLON.BoundingSphere.intersects = function (sphere0, sphere1) {
        var x = sphere0.centerWorld.x - sphere1.centerWorld.x;
        var y = sphere0.centerWorld.y - sphere1.centerWorld.y;
        var z = sphere0.centerWorld.z - sphere1.centerWorld.z;
        var distance = Math.sqrt((x * x) + (y * y) + (z * z));
        if (sphere0.radiusWorld + sphere1.radiusWorld < distance) return false;
        return true;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.BoundingBox = function (minimum, maximum) {
        this.minimum = minimum;
        this.maximum = maximum;
        this.vectors = [];
        this.vectors.push(this.minimum.clone());
        this.vectors.push(this.maximum.clone());
        this.vectors.push(this.minimum.clone());
        this.vectors[2].x = this.maximum.x;
        this.vectors.push(this.minimum.clone());
        this.vectors[3].y = this.maximum.y;
        this.vectors.push(this.minimum.clone());
        this.vectors[4].z = this.maximum.z;
        this.vectors.push(this.maximum.clone());
        this.vectors[5].z = this.minimum.z;
        this.vectors.push(this.maximum.clone());
        this.vectors[6].x = this.minimum.x;
        this.vectors.push(this.maximum.clone());
        this.vectors[7].y = this.minimum.y;
        this.center = this.maximum.add(this.minimum).scale(0.5);
        this.extends = this.maximum.subtract(this.minimum).scale(0.5);
        this.directions = [BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero(), BABYLON.Vector3.Zero()];
        this.vectorsWorld = [];
        for (var index = 0; index < this.vectors.length; index++) {
            this.vectorsWorld[index] = BABYLON.Vector3.Zero();
        }
        this.minimumWorld = BABYLON.Vector3.Zero();
        this.maximumWorld = BABYLON.Vector3.Zero();
        this._update(BABYLON.Matrix.Identity());
    };
    BABYLON.BoundingBox.prototype._update = function (world) {
        BABYLON.Vector3.FromFloatsToRef(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, this.minimumWorld);
        BABYLON.Vector3.FromFloatsToRef(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, this.maximumWorld);
        for (var index = 0; index < this.vectors.length; index++) {
            var v = this.vectorsWorld[index];
            BABYLON.Vector3.TransformCoordinatesToRef(this.vectors[index], world, v);
            if (v.x < this.minimumWorld.x) this.minimumWorld.x = v.x;
            if (v.y < this.minimumWorld.y) this.minimumWorld.y = v.y;
            if (v.z < this.minimumWorld.z) this.minimumWorld.z = v.z;
            if (v.x > this.maximumWorld.x) this.maximumWorld.x = v.x;
            if (v.y > this.maximumWorld.y) this.maximumWorld.y = v.y;
            if (v.z > this.maximumWorld.z) this.maximumWorld.z = v.z;
        }
        this.maximumWorld.addToRef(this.minimumWorld, this.center);
        this.center.scaleInPlace(0.5);
        BABYLON.Vector3.FromArrayToRef(world.m, 0, this.directions[0]);
        BABYLON.Vector3.FromArrayToRef(world.m, 4, this.directions[1]);
        BABYLON.Vector3.FromArrayToRef(world.m, 8, this.directions[2]);
    };
    BABYLON.BoundingBox.prototype.isInFrustum = function (frustumPlanes) {
        return BABYLON.BoundingBox.IsInFrustum(this.vectorsWorld, frustumPlanes);
    };
    BABYLON.BoundingBox.prototype.intersectsPoint = function (point) {
        if (this.maximumWorld.x < point.x || this.minimumWorld.x > point.x) return false;
        if (this.maximumWorld.y < point.y || this.minimumWorld.y > point.y) return false;
        if (this.maximumWorld.z < point.z || this.minimumWorld.z > point.z) return false;
        return true;
    };
    BABYLON.BoundingBox.prototype.intersectsSphere = function (sphere) {
        var vector = BABYLON.Vector3.Clamp(sphere.centerWorld, this.minimumWorld, this.maximumWorld);
        var num = BABYLON.Vector3.DistanceSquared(sphere.centerWorld, vector);
        return (num <= (sphere.radiusWorld * sphere.radiusWorld));
    };
    BABYLON.BoundingBox.prototype.intersectsMinMax = function (min, max) {
        if (this.maximumWorld.x < min.x || this.minimumWorld.x > max.x) return false;
        if (this.maximumWorld.y < min.y || this.minimumWorld.y > max.y) return false;
        if (this.maximumWorld.z < min.z || this.minimumWorld.z > max.z) return false;
        return true;
    };
    BABYLON.BoundingBox.intersects = function (box0, box1) {
        if (box0.maximumWorld.x < box1.minimumWorld.x || box0.minimumWorld.x > box1.maximumWorld.x) return false;
        if (box0.maximumWorld.y < box1.minimumWorld.y || box0.minimumWorld.y > box1.maximumWorld.y) return false;
        if (box0.maximumWorld.z < box1.minimumWorld.z || box0.minimumWorld.z > box1.maximumWorld.z) return false;
        return true;
    };
    BABYLON.BoundingBox.IsInFrustum = function (boundingVectors, frustumPlanes) {
        for (var p = 0; p < 6; p++) {
            var inCount = 8;
            for (var i = 0; i < 8; i++) {
                if (frustumPlanes[p].dotCoordinate(boundingVectors[i]) < 0) {
                    --inCount;
                } else {
                    break;
                }
            }
            if (inCount == 0) return false;
        }
        return true;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.BoundingInfo = function (minimum, maximum) {
        this.boundingBox = new BABYLON.BoundingBox(minimum, maximum);
        this.boundingSphere = new BABYLON.BoundingSphere(minimum, maximum);
    };
    BABYLON.BoundingInfo.prototype._update = function (world, scale) {
        this.boundingBox._update(world);
        this.boundingSphere._update(world, scale);
    };
    var extentsOverlap = function (min0, max0, min1, max1) {
        return !(min0 > max1 || min1 > max0);
    };
    var computeBoxExtents = function (axis, box) {
        var p = BABYLON.Vector3.Dot(box.center, axis);
        var r0 = Math.abs(BABYLON.Vector3.Dot(box.directions[0], axis)) * box.extends.x;
        var r1 = Math.abs(BABYLON.Vector3.Dot(box.directions[1], axis)) * box.extends.y;
        var r2 = Math.abs(BABYLON.Vector3.Dot(box.directions[2], axis)) * box.extends.z;
        var r = r0 + r1 + r2;
        return {
            min: p - r,
            max: p + r
        };
    };
    var axisOverlap = function (axis, box0, box1) {
        var result0 = computeBoxExtents(axis, box0);
        var result1 = computeBoxExtents(axis, box1);
        return extentsOverlap(result0.min, result0.max, result1.min, result1.max);
    };
    BABYLON.BoundingInfo.prototype.isInFrustum = function (frustumPlanes) {
        if (!this.boundingSphere.isInFrustum(frustumPlanes)) return false;
        return this.boundingBox.isInFrustum(frustumPlanes);
    };
    BABYLON.BoundingInfo.prototype._checkCollision = function (collider) {
        return collider._canDoCollision(this.boundingSphere.centerWorld, this.boundingSphere.radiusWorld, this.boundingBox.minimumWorld, this.boundingBox.maximumWorld);
    };
    BABYLON.BoundingInfo.prototype.intersectsPoint = function (point) {
        if (!this.boundingSphere.centerWorld) {
            return false;
        }
        if (!this.boundingSphere.intersectsPoint(point)) {
            return false;
        }
        if (!this.boundingBox.intersectsPoint(point)) {
            return false;
        }
        return true;
    };
    BABYLON.BoundingInfo.prototype.intersects = function (boundingInfo, precise) {
        if (!this.boundingSphere.centerWorld || !boundingInfo.boundingSphere.centerWorld) {
            return false;
        }
        if (!BABYLON.BoundingSphere.intersects(this.boundingSphere, boundingInfo.boundingSphere)) {
            return false;
        }
        if (!BABYLON.BoundingBox.intersects(this.boundingBox, boundingInfo.boundingBox)) {
            return false;
        }
        if (!precise) {
            return true;
        }
        var box0 = this.boundingBox;
        var box1 = boundingInfo.boundingBox;
        if (!axisOverlap(box0.directions[0], box0, box1)) return false;
        if (!axisOverlap(box0.directions[1], box0, box1)) return false;
        if (!axisOverlap(box0.directions[2], box0, box1)) return false;
        if (!axisOverlap(box1.directions[0], box0, box1)) return false;
        if (!axisOverlap(box1.directions[1], box0, box1)) return false;
        if (!axisOverlap(box1.directions[2], box0, box1)) return false;
        if (!axisOverlap(BABYLON.Vector3.Cross(box0.directions[0], box1.directions[0]), box0, box1)) return false;
        if (!axisOverlap(BABYLON.Vector3.Cross(box0.directions[0], box1.directions[1]), box0, box1)) return false;
        if (!axisOverlap(BABYLON.Vector3.Cross(box0.directions[0], box1.directions[2]), box0, box1)) return false;
        if (!axisOverlap(BABYLON.Vector3.Cross(box0.directions[1], box1.directions[0]), box0, box1)) return false;
        if (!axisOverlap(BABYLON.Vector3.Cross(box0.directions[1], box1.directions[1]), box0, box1)) return false;
        if (!axisOverlap(BABYLON.Vector3.Cross(box0.directions[1], box1.directions[2]), box0, box1)) return false;
        if (!axisOverlap(BABYLON.Vector3.Cross(box0.directions[2], box1.directions[0]), box0, box1)) return false;
        if (!axisOverlap(BABYLON.Vector3.Cross(box0.directions[2], box1.directions[1]), box0, box1)) return false;
        if (!axisOverlap(BABYLON.Vector3.Cross(box0.directions[2], box1.directions[2]), box0, box1)) return false;
        return true;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Light = function (name, scene) {
        BABYLON.Node.call(this, scene);
        this.name = name;
        this.id = name;
        scene.lights.push(this);
        this.animations = [];
        this.excludedMeshes = [];
    };
    BABYLON.Light.prototype = Object.create(BABYLON.Node.prototype);
    BABYLON.Light.prototype.intensity = 1.0;
    BABYLON.Light.prototype.getScene = function () {
        return this._scene;
    };
    BABYLON.Light.prototype.getShadowGenerator = function () {
        return this._shadowGenerator;
    };
    BABYLON.Light.prototype.transferToEffect = function () {};
    BABYLON.Light.prototype.getWorldMatrix = function () {
        this._currentRenderId = this._scene.getRenderId();
        var worldMatrix = this._getWorldMatrix();
        if (this.parent && this.parent.getWorldMatrix) {
            if (!this._parentedWorldMatrix) {
                this._parentedWorldMatrix = BABYLON.Matrix.Identity();
            }
            worldMatrix.multiplyToRef(this.parent.getWorldMatrix(), this._parentedWorldMatrix);
            return this._parentedWorldMatrix;
        }
        return worldMatrix;
    };
    BABYLON.Light.prototype.dispose = function () {
        if (this._shadowGenerator) {
            this._shadowGenerator.dispose();
            this._shadowGenerator = null;
        }
        var index = this._scene.lights.indexOf(this);
        this._scene.lights.splice(index, 1);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.PointLight = function (name, position, scene) {
        BABYLON.Light.call(this, name, scene);
        this.position = position;
        this.diffuse = new BABYLON.Color3(1.0, 1.0, 1.0);
        this.specular = new BABYLON.Color3(1.0, 1.0, 1.0);
    };
    BABYLON.PointLight.prototype = Object.create(BABYLON.Light.prototype);
    BABYLON.PointLight.prototype.transferToEffect = function (effect, positionUniformName) {
        if (this.parent && this.parent.getWorldMatrix) {
            if (!this._transformedPosition) {
                this._transformedPosition = BABYLON.Vector3.Zero();
            }
            BABYLON.Vector3.TransformCoordinatesToRef(this.position, this.parent.getWorldMatrix(), this._transformedPosition);
            effect.setFloat4(positionUniformName, this._transformedPosition.x, this._transformedPosition.y, this._transformedPosition.z, 0);
            return;
        }
        effect.setFloat4(positionUniformName, this.position.x, this.position.y, this.position.z, 0);
    };
    BABYLON.PointLight.prototype.getShadowGenerator = function () {
        return null;
    };
    BABYLON.PointLight.prototype._getWorldMatrix = function () {
        if (!this._worldMatrix) {
            this._worldMatrix = BABYLON.Matrix.Identity();
        }
        BABYLON.Matrix.TranslationToRef(this.position.x, this.position.y, this.position.z, this._worldMatrix);
        return this._worldMatrix;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.SpotLight = function (name, position, direction, angle, exponent, scene) {
        BABYLON.Light.call(this, name, scene);
        this.position = position;
        this.direction = direction;
        this.angle = angle;
        this.exponent = exponent;
        this.diffuse = new BABYLON.Color3(1.0, 1.0, 1.0);
        this.specular = new BABYLON.Color3(1.0, 1.0, 1.0);
    };
    BABYLON.SpotLight.prototype = Object.create(BABYLON.Light.prototype);
    BABYLON.SpotLight.prototype.transferToEffect = function (effect, positionUniformName, directionUniformName) {
        var normalizeDirection;
        if (this.parent && this.parent.getWorldMatrix) {
            if (!this._transformedDirection) {
                this._transformedDirection = BABYLON.Vector3.Zero();
            }
            if (!this._transformedPosition) {
                this._transformedPosition = BABYLON.Vector3.Zero();
            }
            var parentWorldMatrix = this.parent.getWorldMatrix();
            BABYLON.Vector3.TransformCoordinatesToRef(this.position, parentWorldMatrix, this._transformedPosition);
            BABYLON.Vector3.TransformNormalToRef(this.direction, parentWorldMatrix, this._transformedDirection);
            effect.setFloat4(positionUniformName, this._transformedPosition.x, this._transformedPosition.y, this._transformedPosition.z, this.exponent);
            normalizeDirection = BABYLON.Vector3.Normalize(this._transformedDirection);
        } else {
            effect.setFloat4(positionUniformName, this.position.x, this.position.y, this.position.z, this.exponent);
            normalizeDirection = BABYLON.Vector3.Normalize(this.direction);
        }
        effect.setFloat4(directionUniformName, normalizeDirection.x, normalizeDirection.y, normalizeDirection.z, Math.cos(this.angle * 0.5));
    };
    BABYLON.SpotLight.prototype._getWorldMatrix = function () {
        if (!this._worldMatrix) {
            this._worldMatrix = BABYLON.Matrix.Identity();
        }
        BABYLON.Matrix.TranslationToRef(this.position.x, this.position.y, this.position.z, this._worldMatrix);
        return this._worldMatrix;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.DirectionalLight = function (name, direction, scene) {
        BABYLON.Light.call(this, name, scene);
        this.position = direction.scale(-1);
        this.direction = direction;
        this.diffuse = new BABYLON.Color3(1.0, 1.0, 1.0);
        this.specular = new BABYLON.Color3(1.0, 1.0, 1.0);
    };
    BABYLON.DirectionalLight.prototype = Object.create(BABYLON.Light.prototype);
    BABYLON.DirectionalLight.prototype._computeTransformedPosition = function () {
        if (this.parent && this.parent.getWorldMatrix) {
            if (!this._transformedPosition) {
                this._transformedPosition = BABYLON.Vector3.Zero();
            }
            BABYLON.Vector3.TransformCoordinatesToRef(this.position, this.parent.getWorldMatrix(), this._transformedPosition);
            return true;
        }
        return false;
    };
    BABYLON.DirectionalLight.prototype.transferToEffect = function (effect, directionUniformName) {
        if (this.parent && this.parent.getWorldMatrix) {
            if (!this._transformedDirection) {
                this._transformedDirection = BABYLON.Vector3.Zero();
            }
            BABYLON.Vector3.TransformNormalToRef(this.direction, this.parent.getWorldMatrix(), this._transformedDirection);
            effect.setFloat4(directionUniformName, this._transformedDirection.x, this._transformedDirection.y, this._transformedDirection.z, 1);
            return;
        }
        effect.setFloat4(directionUniformName, this.direction.x, this.direction.y, this.direction.z, 1);
    };
    BABYLON.DirectionalLight.prototype._getWorldMatrix = function () {
        if (!this._worldMatrix) {
            this._worldMatrix = BABYLON.Matrix.Identity();
        }
        BABYLON.Matrix.TranslationToRef(this.position.x, this.position.y, this.position.z, this._worldMatrix);
        return this._worldMatrix;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.ShadowGenerator = function (mapSize, light) {
        this._light = light;
        this._scene = light.getScene();
        light._shadowGenerator = this;
        this._shadowMap = new BABYLON.RenderTargetTexture(light.name + "_shadowMap", mapSize, this._scene, false);
        this._shadowMap.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        this._shadowMap.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        this._shadowMap.renderParticles = false;
        var that = this;
        var renderSubMesh = function (subMesh) {
            var mesh = subMesh.getMesh();
            var world = mesh.getWorldMatrix();
            var engine = that._scene.getEngine();
            if (that.isReady(mesh)) {
                engine.enableEffect(that._effect);
                if (mesh.skeleton && mesh.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesIndicesKind) && mesh.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesWeightsKind)) {
                    that._effect.setMatrix("world", world);
                    that._effect.setMatrix("viewProjection", that.getTransformMatrix());
                    that._effect.setMatrices("mBones", mesh.skeleton.getTransformMatrices());
                } else {
                    world.multiplyToRef(that.getTransformMatrix(), that._worldViewProjection);
                    that._effect.setMatrix("worldViewProjection", that._worldViewProjection);
                }
                mesh.bindAndDraw(subMesh, that._effect, false);
            }
        };
        this._shadowMap.customRenderFunction = function (opaqueSubMeshes, alphaTestSubMeshes) {
            var index;
            for (index = 0; index < opaqueSubMeshes.length; index++) {
                renderSubMesh(opaqueSubMeshes.data[index]);
            }
            for (index = 0; index < alphaTestSubMeshes.length; index++) {
                renderSubMesh(alphaTestSubMeshes.data[index]);
            }
        };
        this._viewMatrix = BABYLON.Matrix.Zero();
        this._projectionMatrix = BABYLON.Matrix.Zero();
        this._transformMatrix = BABYLON.Matrix.Zero();
        this._worldViewProjection = BABYLON.Matrix.Zero();
    };
    BABYLON.ShadowGenerator.prototype.useVarianceShadowMap = true;
    BABYLON.ShadowGenerator.prototype.isReady = function (mesh) {
        var defines = [];
        if (this.useVarianceShadowMap) {
            defines.push("#define VSM");
        }
        var attribs = [BABYLON.VertexBuffer.PositionKind];
        if (mesh.skeleton && mesh.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesIndicesKind) && mesh.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesWeightsKind)) {
            attribs.push(BABYLON.VertexBuffer.MatricesIndicesKind);
            attribs.push(BABYLON.VertexBuffer.MatricesWeightsKind);
            defines.push("#define BONES");
            defines.push("#define BonesPerMesh " + mesh.skeleton.bones.length);
        }
        var join = defines.join("\n");
        if (this._cachedDefines != join) {
            this._cachedDefines = join;
            this._effect = this._scene.getEngine().createEffect("shadowMap", attribs, ["world", "mBones", "viewProjection", "worldViewProjection"], [], join);
        }
        return this._effect.isReady();
    };
    BABYLON.ShadowGenerator.prototype.getShadowMap = function () {
        return this._shadowMap;
    };
    BABYLON.ShadowGenerator.prototype.getLight = function () {
        return this._light;
    };
    BABYLON.ShadowGenerator.prototype.getTransformMatrix = function () {
        var lightPosition = this._light.position;
        var lightDirection = this._light.direction;
        if (this._light._computeTransformedPosition()) {
            lightPosition = this._light._transformedPosition;
        }
        if (!this._cachedPosition || !this._cachedDirection || !lightPosition.equals(this._cachedPosition) || !lightDirection.equals(this._cachedDirection)) {
            this._cachedPosition = lightPosition.clone();
            this._cachedDirection = lightDirection.clone();
            var activeCamera = this._scene.activeCamera;
            BABYLON.Matrix.LookAtLHToRef(lightPosition, this._light.position.add(lightDirection), BABYLON.Vector3.Up(), this._viewMatrix);
            BABYLON.Matrix.PerspectiveFovLHToRef(Math.PI / 2.0, 1.0, activeCamera.minZ, activeCamera.maxZ, this._projectionMatrix);
            this._viewMatrix.multiplyToRef(this._projectionMatrix, this._transformMatrix);
        }
        return this._transformMatrix;
    };
    BABYLON.ShadowGenerator.prototype.dispose = function () {
        this._shadowMap.dispose();
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.HemisphericLight = function (name, direction, scene) {
        BABYLON.Light.call(this, name, scene);
        this.direction = direction;
        this.diffuse = new BABYLON.Color3(1.0, 1.0, 1.0);
        this.specular = new BABYLON.Color3(1.0, 1.0, 1.0);
        this.groundColor = new BABYLON.Color3(0.0, 0.0, 0.0);
    };
    BABYLON.HemisphericLight.prototype = Object.create(BABYLON.Light.prototype);
    BABYLON.HemisphericLight.prototype.getShadowGenerator = function () {
        return null;
    };
    BABYLON.HemisphericLight.prototype._getWorldMatrix = function () {
        if (!this._worldMatrix) {
            this._worldMatrix = BABYLON.Matrix.Identity();
        }
        return this._worldMatrix;
    };
    BABYLON.HemisphericLight.prototype.transferToEffect = function (effect, directionUniformName, groundColorUniformName) {
        var normalizeDirection = BABYLON.Vector3.Normalize(this.direction);
        effect.setFloat4(directionUniformName, normalizeDirection.x, normalizeDirection.y, normalizeDirection.z, 0);
        effect.setColor3(groundColorUniformName, this.groundColor.scale(this.intensity));
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Collider = function () {
        this.radius = new BABYLON.Vector3(1, 1, 1);
        this.retry = 0;
        this.basePointWorld = BABYLON.Vector3.Zero();
        this.velocityWorld = BABYLON.Vector3.Zero();
        this.normalizedVelocity = BABYLON.Vector3.Zero();
        this._collisionPoint = BABYLON.Vector3.Zero();
        this._planeIntersectionPoint = BABYLON.Vector3.Zero();
        this._tempVector = BABYLON.Vector3.Zero();
        this._tempVector2 = BABYLON.Vector3.Zero();
        this._tempVector3 = BABYLON.Vector3.Zero();
        this._tempVector4 = BABYLON.Vector3.Zero();
        this._edge = BABYLON.Vector3.Zero();
        this._baseToVertex = BABYLON.Vector3.Zero();
        this._destinationPoint = BABYLON.Vector3.Zero();
        this._slidePlaneNormal = BABYLON.Vector3.Zero();
        this._displacementVector = BABYLON.Vector3.Zero();
    };
    BABYLON.Collider.prototype._initialize = function (source, dir, e) {
        this.velocity = dir;
        BABYLON.Vector3.NormalizeToRef(dir, this.normalizedVelocity);
        this.basePoint = source;
        source.multiplyToRef(this.radius, this.basePointWorld);
        dir.multiplyToRef(this.radius, this.velocityWorld);
        this.velocityWorldLength = this.velocityWorld.length();
        this.epsilon = e;
        this.collisionFound = false;
    };
    BABYLON.Collider.prototype._checkPointInTriangle = function (point, pa, pb, pc, n) {
        pa.subtractToRef(point, this._tempVector);
        pb.subtractToRef(point, this._tempVector2);
        BABYLON.Vector3.CrossToRef(this._tempVector, this._tempVector2, this._tempVector4);
        var d = BABYLON.Vector3.Dot(this._tempVector4, n);
        if (d < 0) return false;
        pc.subtractToRef(point, this._tempVector3);
        BABYLON.Vector3.CrossToRef(this._tempVector2, this._tempVector3, this._tempVector4);
        d = BABYLON.Vector3.Dot(this._tempVector4, n);
        if (d < 0) return false;
        BABYLON.Vector3.CrossToRef(this._tempVector3, this._tempVector, this._tempVector4);
        d = BABYLON.Vector3.Dot(this._tempVector4, n);
        return d >= 0;
    };
    var intersectBoxAASphere = function (boxMin, boxMax, sphereCenter, sphereRadius) {
        if (boxMin.x > sphereCenter.x + sphereRadius) return false;
        if (sphereCenter.x - sphereRadius > boxMax.x) return false;
        if (boxMin.y > sphereCenter.y + sphereRadius) return false;
        if (sphereCenter.y - sphereRadius > boxMax.y) return false;
        if (boxMin.z > sphereCenter.z + sphereRadius) return false;
        if (sphereCenter.z - sphereRadius > boxMax.z) return false;
        return true;
    };
    var getLowestRoot = function (a, b, c, maxR) {
        var determinant = b * b - 4.0 * a * c;
        var result = {
            root: 0,
            found: false
        };
        if (determinant < 0) return result;
        var sqrtD = Math.sqrt(determinant);
        var r1 = (-b - sqrtD) / (2.0 * a);
        var r2 = (-b + sqrtD) / (2.0 * a);
        if (r1 > r2) {
            var temp = r2;
            r2 = r1;
            r1 = temp;
        }
        if (r1 > 0 && r1 < maxR) {
            result.root = r1;
            result.found = true;
            return result;
        }
        if (r2 > 0 && r2 < maxR) {
            result.root = r2;
            result.found = true;
            return result;
        }
        return result;
    };
    BABYLON.Collider.prototype._canDoCollision = function (sphereCenter, sphereRadius, vecMin, vecMax) {
        var distance = BABYLON.Vector3.Distance(this.basePointWorld, sphereCenter);
        var max = Math.max(this.radius.x, this.radius.y);
        max = Math.max(max, this.radius.z);
        if (distance > this.velocityWorldLength + max + sphereRadius) {
            return false;
        }
        if (!intersectBoxAASphere(vecMin, vecMax, this.basePointWorld, this.velocityWorldLength + max)) return false;
        return true;
    };
    BABYLON.Collider.prototype._testTriangle = function (faceIndex, subMesh, p1, p2, p3) {
        var t0;
        var embeddedInPlane = false;
        if (!subMesh._trianglePlanes) {
            subMesh._trianglePlanes = [];
        }
        if (!subMesh._trianglePlanes[faceIndex]) {
            subMesh._trianglePlanes[faceIndex] = new BABYLON.Plane(0, 0, 0, 0);
            subMesh._trianglePlanes[faceIndex].copyFromPoints(p1, p2, p3);
        }
        var trianglePlane = subMesh._trianglePlanes[faceIndex];
        if ((!subMesh.getMaterial()) && !trianglePlane.isFrontFacingTo(this.normalizedVelocity, 0)) return;
        var signedDistToTrianglePlane = trianglePlane.signedDistanceTo(this.basePoint);
        var normalDotVelocity = BABYLON.Vector3.Dot(trianglePlane.normal, this.velocity);
        if (normalDotVelocity == 0) {
            if (Math.abs(signedDistToTrianglePlane) >= 1.0) return;
            embeddedInPlane = true;
            t0 = 0;
        } else {
            t0 = (-1.0 - signedDistToTrianglePlane) / normalDotVelocity;
            var t1 = (1.0 - signedDistToTrianglePlane) / normalDotVelocity;
            if (t0 > t1) {
                var temp = t1;
                t1 = t0;
                t0 = temp;
            }
            if (t0 > 1.0 || t1 < 0.0) return;
            if (t0 < 0) t0 = 0;
            if (t0 > 1.0) t0 = 1.0;
        }
        this._collisionPoint.copyFromFloats(0, 0, 0);
        var found = false;
        var t = 1.0;
        if (!embeddedInPlane) {
            this.basePoint.subtractToRef(trianglePlane.normal, this._planeIntersectionPoint);
            this.velocity.scaleToRef(t0, this._tempVector);
            this._planeIntersectionPoint.addInPlace(this._tempVector);
            if (this._checkPointInTriangle(this._planeIntersectionPoint, p1, p2, p3, trianglePlane.normal)) {
                found = true;
                t = t0;
                this._collisionPoint.copyFrom(this._planeIntersectionPoint);
            }
        }
        if (!found) {
            var velocitySquaredLength = this.velocity.lengthSquared();
            var a = velocitySquaredLength;
            this.basePoint.subtractToRef(p1, this._tempVector);
            var b = 2.0 * (BABYLON.Vector3.Dot(this.velocity, this._tempVector));
            var c = this._tempVector.lengthSquared - 1.0;
            var lowestRoot = getLowestRoot(a, b, c, t);
            if (lowestRoot.found) {
                t = lowestRoot.root;
                found = true;
                this._collisionPoint.copyFrom(p1);
            }
            this.basePoint.subtractToRef(p2, this._tempVector);
            b = 2.0 * (BABYLON.Vector3.Dot(this.velocity, this._tempVector));
            c = this._tempVector.lengthSquared - 1.0;
            lowestRoot = getLowestRoot(a, b, c, t);
            if (lowestRoot.found) {
                t = lowestRoot.root;
                found = true;
                this._collisionPoint.copyFrom(p2);
            }
            this.basePoint.subtractToRef(p3, this._tempVector);
            b = 2.0 * (BABYLON.Vector3.Dot(this.velocity, this._tempVector));
            c = this._tempVector.lengthSquared - 1.0;
            lowestRoot = getLowestRoot(a, b, c, t);
            if (lowestRoot.found) {
                t = lowestRoot.root;
                found = true;
                this._collisionPoint.copyFrom(p3);
            }
            p2.subtractToRef(p1, this._edge);
            p1.subtractToRef(this.basePoint, this._baseToVertex);
            var edgeSquaredLength = this._edge.lengthSquared();
            var edgeDotVelocity = BABYLON.Vector3.Dot(this._edge, this.velocity);
            var edgeDotBaseToVertex = BABYLON.Vector3.Dot(this._edge, this._baseToVertex);
            a = edgeSquaredLength * (-velocitySquaredLength) + edgeDotVelocity * edgeDotVelocity;
            b = edgeSquaredLength * (2.0 * BABYLON.Vector3.Dot(this.velocity, this._baseToVertex)) - 2.0 * edgeDotVelocity * edgeDotBaseToVertex;
            c = edgeSquaredLength * (1.0 - this._baseToVertex.lengthSquared()) + edgeDotBaseToVertex * edgeDotBaseToVertex;
            lowestRoot = getLowestRoot(a, b, c, t);
            if (lowestRoot.found) {
                var f = (edgeDotVelocity * lowestRoot.root - edgeDotBaseToVertex) / edgeSquaredLength;
                if (f >= 0.0 && f <= 1.0) {
                    t = lowestRoot.root;
                    found = true;
                    this._edge.scaleInPlace(f);
                    p1.addToRef(this._edge, this._collisionPoint);
                }
            }
            p3.subtractToRef(p2, this._edge);
            p2.subtractToRef(this.basePoint, this._baseToVertex);
            edgeSquaredLength = this._edge.lengthSquared();
            edgeDotVelocity = BABYLON.Vector3.Dot(this._edge, this.velocity);
            edgeDotBaseToVertex = BABYLON.Vector3.Dot(this._edge, this._baseToVertex);
            a = edgeSquaredLength * (-velocitySquaredLength) + edgeDotVelocity * edgeDotVelocity;
            b = edgeSquaredLength * (2.0 * BABYLON.Vector3.Dot(this.velocity, this._baseToVertex)) - 2.0 * edgeDotVelocity * edgeDotBaseToVertex;
            c = edgeSquaredLength * (1.0 - this._baseToVertex.lengthSquared()) + edgeDotBaseToVertex * edgeDotBaseToVertex;
            lowestRoot = getLowestRoot(a, b, c, t);
            if (lowestRoot.found) {
                var f = (edgeDotVelocity * lowestRoot.root - edgeDotBaseToVertex) / edgeSquaredLength;
                if (f >= 0.0 && f <= 1.0) {
                    t = lowestRoot.root;
                    found = true;
                    this._edge.scaleInPlace(f);
                    p2.addToRef(this._edge, this._collisionPoint);
                }
            }
            p1.subtractToRef(p3, this._edge);
            p3.subtractToRef(this.basePoint, this._baseToVertex);
            edgeSquaredLength = this._edge.lengthSquared();
            edgeDotVelocity = BABYLON.Vector3.Dot(this._edge, this.velocity);
            edgeDotBaseToVertex = BABYLON.Vector3.Dot(this._edge, this._baseToVertex);
            a = edgeSquaredLength * (-velocitySquaredLength) + edgeDotVelocity * edgeDotVelocity;
            b = edgeSquaredLength * (2.0 * BABYLON.Vector3.Dot(this.velocity, this._baseToVertex)) - 2.0 * edgeDotVelocity * edgeDotBaseToVertex;
            c = edgeSquaredLength * (1.0 - this._baseToVertex.lengthSquared()) + edgeDotBaseToVertex * edgeDotBaseToVertex;
            lowestRoot = getLowestRoot(a, b, c, t);
            if (lowestRoot.found) {
                var f = (edgeDotVelocity * lowestRoot.root - edgeDotBaseToVertex) / edgeSquaredLength;
                if (f >= 0.0 && f <= 1.0) {
                    t = lowestRoot.root;
                    found = true;
                    this._edge.scaleInPlace(f);
                    p3.addToRef(this._edge, this._collisionPoint);
                }
            }
        }
        if (found) {
            var distToCollision = t * this.velocity.length();
            if (!this.collisionFound || distToCollision < this.nearestDistance) {
                if (!this.intersectionPoint) {
                    this.intersectionPoint = this._collisionPoint.clone();
                } else {
                    this.intersectionPoint.copyFrom(this._collisionPoint);
                }
                this.nearestDistance = distToCollision;
                this.collisionFound = true;
                this.collidedMesh = subMesh.getMesh();
            }
        }
    };
    BABYLON.Collider.prototype._collide = function (subMesh, pts, indices, indexStart, indexEnd, decal) {
        for (var i = indexStart; i < indexEnd; i += 3) {
            var p1 = pts[indices[i] - decal];
            var p2 = pts[indices[i + 1] - decal];
            var p3 = pts[indices[i + 2] - decal];
            this._testTriangle(i, subMesh, p3, p2, p1);
        }
    };
    BABYLON.Collider.prototype._getResponse = function (pos, vel) {
        pos.addToRef(vel, this._destinationPoint);
        vel.scaleInPlace((this.nearestDistance / vel.length()));
        this.basePoint.addToRef(vel, pos);
        pos.subtractToRef(this.intersectionPoint, this._slidePlaneNormal);
        this._slidePlaneNormal.normalize();
        this._slidePlaneNormal.scaleToRef(this.epsilon, this._displacementVector);
        pos.addInPlace(this._displacementVector);
        this.intersectionPoint.addInPlace(this._displacementVector);
        this._slidePlaneNormal.scaleInPlace(BABYLON.Plane.SignedDistanceToPlaneFromPositionAndNormal(this.intersectionPoint, this._slidePlaneNormal, this._destinationPoint));
        this._destinationPoint.subtractInPlace(this._slidePlaneNormal);
        this._destinationPoint.subtractToRef(this.intersectionPoint, vel);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.InputControllerTarget = function () {
        this._position = new BABYLON.Vector3(0, 0, 0);
        this._orientation = {
            yaw: 0.0,
            pitch: 0.0,
            roll: 0.0
        };
    };
    BABYLON.InputControllerTarget.prototype.getPosition = function () {
        return this._position;
    };
    BABYLON.InputControllerTarget.prototype.getOrientation = function () {
        return this._orientation;
    };
    BABYLON.InputControllerTarget.prototype.moveRelative = function (movementVector) {};
    BABYLON.InputControllerTarget.prototype.rotateRelative = function (relativeOrientation) {};
    BABYLON.InputControllerTarget.prototype.getOrientationMatrix = function () {
        return new BABYLON.Matrix();
    };
    BABYLON.InputControllerTarget.prototype.getInvertOrientationMatrix = function () {
        return new BABYLON.Matrix();
    };
    BABYLON.InputControllerMultiTarget = function (targets) {
        this.targets = targets;
        var mainTarget = this.targets[0];
        if (!mainTarget.controllers) {
            mainTarget.controllers = [this];
        } else {
            mainTarget.controllers.push(this);
        }
    };
    BABYLON.InputControllerMultiTarget.prototype.getPosition = function () {
        return this.targets[0].getPosition();
    };
    BABYLON.InputControllerMultiTarget.prototype.getOrientation = function () {
        return this.targets[0].getOrientation();
    };
    BABYLON.InputControllerMultiTarget.prototype.getOrientationMatrix = function () {
        return this.targets[0].getOrientationMatrix();
    };
    BABYLON.InputControllerMultiTarget.prototype.getInvertOrientationMatrix = function () {
        return this.targets[0].getInvertOrientationMatrix();
    };
    BABYLON.InputControllerMultiTarget.prototype.moveRelative = function (movementVector) {
        for (var i = 0; i < this.targets.length; ++i) {
            this.targets[i].moveRelative(movementVector);
        }
    };
    BABYLON.InputControllerMultiTarget.prototype.rotateRelative = function (relativeOrientation) {
        for (var i = 0; i < this.targets.length; ++i) {
            this.targets[i].rotateRelative(relativeOrientation);
        }
    };
    BABYLON.InputControllerMultiTarget.prototype.update = function () {
        if (this.controllers) {
            for (var i = 0; i < this.controllers.length; ++i) {
                this.controllers[i].update();
            }
        }
    };
    BABYLON.InputController = function (scene, target) {
        this.scene = scene;
        this.target = target;
        if (!this.target.controllers) {
            this.target.controllers = [this];
        } else {
            this.target.controllers.push(this);
        }
    };
    BABYLON.InputController.prototype.attachToCanvas = function (canvas) {};
    BABYLON.InputController.prototype.detachFromCanvas = function (canvas) {};
    BABYLON.InputController.prototype.update = function () {};
    BABYLON.InputController.prototype.dispose = function () {};
    BABYLON.inputFilter = function (scene, target) {
        BABYLON.InputController.call(this, scene, target);
    };
    BABYLON.inputFilter.prototype = Object.create(BABYLON.InputController.prototype);
    BABYLON.inputFilter.prototype.update = function () {
        if (this.controllers) {
            for (var i = 0; i < this.controllers.length; ++i) {
                this.controllers[i].update();
            }
        }
    };
    BABYLON.inputFilter.prototype.getPosition = function () {
        return this.target.getPosition();
    };
    BABYLON.inputFilter.prototype.getOrientation = function () {
        return this.target.getOrientation();
    };
    BABYLON.inputFilter.prototype.getOrientationMatrix = function () {
        return this.target.getOrientationMatrix();
    };
    BABYLON.inputFilter.prototype.getInvertOrientationMatrix = function () {
        return this.target.getInvertOrientationMatrix();
    };
    BABYLON.inputFilter.prototype.moveRelative = function (movementVector) {
        this.target.moveRelative(movementVector);
    };
    BABYLON.inputFilter.prototype.rotateRelative = function (relativeOrientation) {
        this.target.rotateRelative(relativeOrientation);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Camera = function (name, position, scene) {
        BABYLON.Node.call(this, scene);
        this.name = name;
        this.id = name;
        this.position = position;
        this.upVector = BABYLON.Vector3.Up();
        scene.cameras.push(this);
        if (!scene.activeCamera) {
            scene.activeCamera = this;
        }
        this._computedViewMatrix = BABYLON.Matrix.Identity();
        this._projectionMatrix = new BABYLON.Matrix();
        this.animations = [];
        this._postProcesses = [];
        this._postProcessesTakenIndices = [];
        this.viewport = new BABYLON.Viewport(0, 0, 1.0, 1.0);
        BABYLON.Camera.prototype._initCache.call(this);
    };
    BABYLON.Camera.prototype = Object.create(BABYLON.Node.prototype);
    BABYLON.Camera.PERSPECTIVE_CAMERA = 0;
    BABYLON.Camera.ORTHOGRAPHIC_CAMERA = 1;
    BABYLON.Camera.prototype.orthoLeft = null;
    BABYLON.Camera.prototype.orthoRight = null;
    BABYLON.Camera.prototype.orthoBottom = null;
    BABYLON.Camera.prototype.orthoTop = null;
    BABYLON.Camera.prototype.fov = 0.8;
    BABYLON.Camera.prototype.minZ = 0.1;
    BABYLON.Camera.prototype.maxZ = 1000.0;
    BABYLON.Camera.prototype.inertia = 0.9;
    BABYLON.Camera.prototype.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
    BABYLON.Camera.prototype.getScene = function () {
        return this._scene;
    };
    BABYLON.Camera.prototype._initCache = function () {
        this._cache.position = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        this._cache.upVector = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        this._cache.mode = undefined;
        this._cache.minZ = undefined;
        this._cache.maxZ = undefined;
        this._cache.fov = undefined;
        this._cache.aspectRatio = undefined;
        this._cache.orthoLeft = undefined;
        this._cache.orthoRight = undefined;
        this._cache.orthoBottom = undefined;
        this._cache.orthoTop = undefined;
        this._cache.renderWidth = undefined;
        this._cache.renderHeight = undefined;
    };
    BABYLON.Camera.prototype._updateCache = function (ignoreParentClass) {
        if (!ignoreParentClass) {
            BABYLON.Node.prototype._updateCache.call(this);
        }
        var engine = this._scene.getEngine();
        this._cache.position.copyFrom(this.position);
        this._cache.upVector.copyFrom(this.upVector);
        this._cache.mode = this.mode;
        this._cache.minZ = this.minZ;
        this._cache.maxZ = this.maxZ;
        this._cache.fov = this.fov;
        this._cache.aspectRatio = engine.getAspectRatio(this);
        this._cache.orthoLeft = this.orthoLeft;
        this._cache.orthoRight = this.orthoRight;
        this._cache.orthoBottom = this.orthoBottom;
        this._cache.orthoTop = this.orthoTop;
        this._cache.renderWidth = engine.getRenderWidth();
        this._cache.renderHeight = engine.getRenderHeight();
    };
    BABYLON.Camera.prototype._updateFromScene = function () {
        this.updateCache();
        this._update();
    };
    BABYLON.Camera.prototype._isSynchronized = function () {
        return this._isSynchronizedViewMatrix() && this._isSynchronizedProjectionMatrix();
    };
    BABYLON.Camera.prototype._isSynchronizedViewMatrix = function () {
        if (!BABYLON.Node.prototype._isSynchronized.call(this)) return false;
        return this._cache.position.equals(this.position) && this._cache.upVector.equals(this.upVector) && this.isSynchronizedWithParent();
    };
    BABYLON.Camera.prototype._isSynchronizedProjectionMatrix = function () {
        var check = this._cache.mode === this.mode && this._cache.minZ === this.minZ && this._cache.maxZ === this.maxZ;
        if (!check) {
            return false;
        }
        var engine = this._scene.getEngine();
        if (this.mode === BABYLON.Camera.PERSPECTIVE_CAMERA) {
            check = this._cache.fov === this.fov && this._cache.aspectRatio === engine.getAspectRatio(this);
        } else {
            check = this._cache.orthoLeft === this.orthoLeft && this._cache.orthoRight === this.orthoRight && this._cache.orthoBottom === this.orthoBottom && this._cache.orthoTop === this.orthoTop && this._cache.renderWidth === engine.getRenderWidth() && this._cache.renderHeight === engine.getRenderHeight();
        }
        return check;
    };
    BABYLON.Camera.prototype.attachControl = function (canvas) {};
    BABYLON.Camera.prototype.detachControl = function (canvas) {};
    BABYLON.Camera.prototype._update = function () {};
    BABYLON.Camera.prototype.attachPostProcess = function (postProcess, insertAt) {
        if (!postProcess._reusable && this._postProcesses.indexOf(postProcess) > -1) {
            console.error("You're trying to reuse a post process not defined as reusable.");
            return;
        }
        if (insertAt == null || insertAt < 0) {
            this._postProcesses.push(postProcess);
            this._postProcessesTakenIndices.push(this._postProcesses.length - 1);
            return this._postProcesses.length - 1;
        }
        var add = 0;
        if (this._postProcesses[insertAt]) {
            var start = this._postProcesses.length - 1;
            for (var i = start; i >= insertAt + 1; --i) {
                this._postProcesses[i + 1] = this._postProcesses[i];
            }
            add = 1;
        }
        for (var i = 0; i < this._postProcessesTakenIndices.length; ++i) {
            if (this._postProcessesTakenIndices[i] < insertAt) {
                continue;
            }
            var start = this._postProcessesTakenIndices.length - 1;
            for (var j = start; j >= i; --j) {
                this._postProcessesTakenIndices[j + 1] = this._postProcessesTakenIndices[j] + add;
            }
            this._postProcessesTakenIndices[i] = insertAt;
            break;
        }
        if (!add && this._postProcessesTakenIndices.indexOf(insertAt) == -1) {
            this._postProcessesTakenIndices.push(insertAt);
        }
        var result = insertAt + add;
        this._postProcesses[result] = postProcess;
        return result;
    };
    BABYLON.Camera.prototype.detachPostProcess = function (postProcess, atIndices) {
        var result = [];
        if (!atIndices) {
            var length = this._postProcesses.length;
            for (var i = 0; i < length; i++) {
                if (this._postProcesses[i] !== postProcess) {
                    continue;
                }
                delete this._postProcesses[i];
                var index = this._postProcessesTakenIndices.indexOf(i);
                this._postProcessesTakenIndices.splice(index, 1);
            }
        } else {
            atIndices = (atIndices instanceof Array) ? atIndices : [atIndices];
            for (var i = 0; i < atIndices.length; i++) {
                var foundPostProcess = this._postProcesses[atIndices[i]];
                if (foundPostProcess !== postProcess) {
                    result.push(i);
                    continue;
                }
                delete this._postProcesses[atIndices[i]];
                var index = this._postProcessesTakenIndices.indexOf(atIndices[i]);
                this._postProcessesTakenIndices.splice(index, 1);
            }
        }
        return result;
    };
    BABYLON.Camera.prototype.getWorldMatrix = function () {
        if (!this._worldMatrix) {
            this._worldMatrix = BABYLON.Matrix.Identity();
        }
        var viewMatrix = this.getViewMatrix();
        viewMatrix.invertToRef(this._worldMatrix);
        return this._worldMatrix;
    };
    BABYLON.Camera.prototype._getViewMatrix = function () {
        return BABYLON.Matrix.Identity();
    };
    BABYLON.Camera.prototype.getViewMatrix = function () {
        this._computedViewMatrix = this._computeViewMatrix();
        if (!this.parent || !this.parent.getWorldMatrix || this.isSynchronized()) {
            return this._computedViewMatrix;
        }
        if (!this._worldMatrix) {
            this._worldMatrix = BABYLON.Matrix.Identity();
        }
        this._computedViewMatrix.invertToRef(this._worldMatrix);
        this._worldMatrix.multiplyToRef(this.parent.getWorldMatrix(), this._computedViewMatrix);
        this._computedViewMatrix.invert();
        return this._computedViewMatrix;
    };
    BABYLON.Camera.prototype._computeViewMatrix = function (force) {
        if (!force && this._isSynchronizedViewMatrix()) {
            this._currentRenderId = this._scene.getRenderId();
            return this._computedViewMatrix;
        }
        this._computedViewMatrix = this._getViewMatrix();
        return this._computedViewMatrix;
    };
    BABYLON.Camera.prototype.getProjectionMatrix = function (force) {
        if (!force && this._isSynchronizedProjectionMatrix()) {
            return this._projectionMatrix;
        }
        var engine = this._scene.getEngine();
        if (this.mode === BABYLON.Camera.PERSPECTIVE_CAMERA) {
            BABYLON.Matrix.PerspectiveFovLHToRef(this.fov, engine.getAspectRatio(this), this.minZ, this.maxZ, this._projectionMatrix);
            return this._projectionMatrix;
        }
        var halfWidth = engine.getRenderWidth() / 2.0;
        var halfHeight = engine.getRenderHeight() / 2.0;
        BABYLON.Matrix.OrthoOffCenterLHToRef(this.orthoLeft || -halfWidth, this.orthoRight || halfWidth, this.orthoBottom || -halfHeight, this.orthoTop || halfHeight, this.minZ, this.maxZ, this._projectionMatrix);
        return this._projectionMatrix;
    };
    BABYLON.Camera.prototype.dispose = function () {
        var index = this._scene.cameras.indexOf(this);
        this._scene.cameras.splice(index, 1);
        for (var i = 0; i < this._postProcessesTakenIndices.length; ++i) {
            this._postProcesses[this._postProcessesTakenIndices[i]].dispose(this);
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.FreeCamera = function (name, position, scene) {
        BABYLON.Camera.call(this, name, position, scene);
        this.cameraDirection = new BABYLON.Vector3(0, 0, 0);
        this.cameraRotation = new BABYLON.Vector2(0, 0);
        this.rotation = new BABYLON.Vector3(0, 0, 0);
        this.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
        this._keys = [];
        this.keysUp = [38];
        this.keysDown = [40];
        this.keysLeft = [37];
        this.keysRight = [39];
        this._collider = new BABYLON.Collider();
        this._needMoveForGravity = true;
        this._currentTarget = BABYLON.Vector3.Zero();
        this._viewMatrix = BABYLON.Matrix.Zero();
        this._camMatrix = BABYLON.Matrix.Zero();
        this._cameraTransformMatrix = BABYLON.Matrix.Zero();
        this._cameraRotationMatrix = BABYLON.Matrix.Zero();
        this._referencePoint = BABYLON.Vector3.Zero();
        this._transformedReferencePoint = BABYLON.Vector3.Zero();
        this._oldPosition = BABYLON.Vector3.Zero();
        this._diffPosition = BABYLON.Vector3.Zero();
        this._newPosition = BABYLON.Vector3.Zero();
        this._lookAtTemp = BABYLON.Matrix.Zero();
        this._tempMatrix = BABYLON.Matrix.Zero();
        BABYLON.FreeCamera.prototype._initCache.call(this);
    };
    BABYLON.FreeCamera.prototype = Object.create(BABYLON.Camera.prototype);
    BABYLON.FreeCamera.prototype.speed = 2.0;
    BABYLON.FreeCamera.prototype.checkCollisions = false;
    BABYLON.FreeCamera.prototype.applyGravity = false;
    BABYLON.FreeCamera.prototype.noRotationConstraint = false;
    BABYLON.FreeCamera.prototype.angularSensibility = 2000.0;
    BABYLON.FreeCamera.prototype.lockedTarget = null;
    BABYLON.FreeCamera.prototype.onCollide = null;
    BABYLON.FreeCamera.prototype._getLockedTargetPosition = function () {
        if (!this.lockedTarget) {
            return null;
        }
        return this.lockedTarget.position || this.lockedTarget;
    };
    BABYLON.FreeCamera.prototype._initCache = function () {
        this._cache.lockedTarget = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        this._cache.rotation = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    };
    BABYLON.FreeCamera.prototype._updateCache = function (ignoreParentClass) {
        if (!ignoreParentClass) BABYLON.Camera.prototype._updateCache.call(this);
        var lockedTargetPosition = this._getLockedTargetPosition();
        if (!lockedTargetPosition) {
            this._cache.lockedTarget = null;
        } else {
            if (!this._cache.lockedTarget) {
                this._cache.lockedTarget = lockedTargetPosition.clone();
            } else {
                this._cache.lockedTarget.copyFrom(lockedTargetPosition);
            }
        }
        this._cache.rotation.copyFrom(this.rotation);
    };
    BABYLON.FreeCamera.prototype._isSynchronizedViewMatrix = function () {
        if (!BABYLON.Camera.prototype._isSynchronizedViewMatrix.call(this)) {
            return false;
        }
        var lockedTargetPosition = this._getLockedTargetPosition();
        return (this._cache.lockedTarget ? this._cache.lockedTarget.equals(lockedTargetPosition) : !lockedTargetPosition) && this._cache.rotation.equals(this.rotation);
    };
    BABYLON.FreeCamera.prototype._computeLocalCameraSpeed = function () {
        return this.speed * ((BABYLON.Tools.GetDeltaTime() / (BABYLON.Tools.GetFps() * 10.0)));
    };
    BABYLON.FreeCamera.prototype.setTarget = function (target) {
        this.upVector.normalize();
        BABYLON.Matrix.LookAtLHToRef(this.position, target, this.upVector, this._camMatrix);
        this._camMatrix.invert();
        this.rotation.x = Math.atan(this._camMatrix.m[6] / this._camMatrix.m[10]);
        var vDir = target.subtract(this.position);
        if (vDir.x >= 0.0) {
            this.rotation.y = (-Math.atan(vDir.z / vDir.x) + Math.PI / 2.0);
        } else {
            this.rotation.y = (-Math.atan(vDir.z / vDir.x) - Math.PI / 2.0);
        }
        this.rotation.z = -Math.acos(BABYLON.Vector3.Dot(new BABYLON.Vector3(0, 1.0, 0), this.upVector));
        if (isNaN(this.rotation.x)) {
            this.rotation.x = 0;
        }
        if (isNaN(this.rotation.y)) {
            this.rotation.y = 0;
        }
        if (isNaN(this.rotation.z)) {
            this.rotation.z = 0;
        }
    };
    BABYLON.FreeCamera.prototype.attachControl = function (canvas, noPreventDefault) {
        var previousPosition;
        var that = this;
        var engine = this._scene.getEngine();
        if (this._attachedCanvas) {
            return;
        }
        this._attachedCanvas = canvas;
        if (this._onMouseDown === undefined) {
            this._onMouseDown = function (evt) {
                previousPosition = {
                    x: evt.clientX,
                    y: evt.clientY
                };
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };

            /////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////////////////////////////////
            
            this._onMouseUp = function (evt) {
                //previousPosition = null;
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };
            this._onMouseOut = function (evt) {
                previousPosition = null;
                that._keys = [];
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };
            this._onMouseMove = function (evt) {

                /////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////////

                //console.log(previousPosition ,engine.isPointerLock)
                if (!previousPosition && !engine.isPointerLock) {
                    return;
                }
                //console.log(evt);
                var offsetX;
                var offsetY;
                if (!engine.isPointerLock) {
                    offsetX = evt.clientX - previousPosition.x;
                    offsetY = evt.clientY - previousPosition.y;
                } else {
                    offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || (previousPosition ? evt.clientX - previousPosition.x : 0);
                    offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || (previousPosition ? evt.clientY - previousPosition.y : 0);
                    //console.log(offsetX, offsetY);? 
                    //console.log(offsetX, evt.clientX - previousPosition.x);
                }
                that.cameraRotation.y += offsetX / that.angularSensibility;
                that.cameraRotation.x += offsetY / that.angularSensibility;
                previousPosition = {
                    x: evt.clientX,
                    y: evt.clientY
                };

                /////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////////
            };
            this._onKeyDown = function (evt) {
                if (that.keysUp.indexOf(evt.keyCode) !== -1 || that.keysDown.indexOf(evt.keyCode) !== -1 || that.keysLeft.indexOf(evt.keyCode) !== -1 || that.keysRight.indexOf(evt.keyCode) !== -1) {
                    var index = that._keys.indexOf(evt.keyCode);
                    if (index === -1) {
                        that._keys.push(evt.keyCode);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            this._onKeyUp = function (evt) {
                if (that.keysUp.indexOf(evt.keyCode) !== -1 || that.keysDown.indexOf(evt.keyCode) !== -1 || that.keysLeft.indexOf(evt.keyCode) !== -1 || that.keysRight.indexOf(evt.keyCode) !== -1) {
                    var index = that._keys.indexOf(evt.keyCode);
                    if (index >= 0) {
                        that._keys.splice(index, 1);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            this._onLostFocus = function () {
                that._keys = [];
            };
            this._reset = function () {
                that._keys = [];
                previousPosition = null;
                that.cameraDirection = new BABYLON.Vector3(0, 0, 0);
                that.cameraRotation = new BABYLON.Vector2(0, 0);
            };
        }
        window.addEventListener("mousedown", this._onMouseDown, false);
        window.addEventListener("mouseup", this._onMouseUp, false);
        window.addEventListener("mouseout", this._onMouseOut, false);
        window.addEventListener("mousemove", this._onMouseMove, false);
        window.addEventListener("keydown", this._onKeyDown, false);
        window.addEventListener("keyup", this._onKeyUp, false);
        window.addEventListener("blur", this._onLostFocus, false);
    };
    BABYLON.FreeCamera.prototype.detachControl = function (canvas) {
        if (this._attachedCanvas != canvas) {
            return;
        }
        window.removeEventListener("mousedown", this._onMouseDown);
        window.removeEventListener("mouseup", this._onMouseUp);
        window.removeEventListener("mouseout", this._onMouseOut);
        window.removeEventListener("mousemove", this._onMouseMove);
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
        window.removeEventListener("blur", this._onLostFocus);
        this._attachedCanvas = null;
        if (this._reset) {
            this._reset();
        }
    };
    BABYLON.FreeCamera.prototype._collideWithWorld = function (velocity) {
        this.position.subtractFromFloatsToRef(0, this.ellipsoid.y, 0, this._oldPosition);
        this._collider.radius = this.ellipsoid;
        this._scene._getNewPosition(this._oldPosition, velocity, this._collider, 3, this._newPosition);
        this._newPosition.subtractToRef(this._oldPosition, this._diffPosition);
        if (this._diffPosition.length() > BABYLON.Engine.collisionsEpsilon) {
            this.position.addInPlace(this._diffPosition);
            if (this.onCollide) {
                this.onCollide(this._collider.collidedMesh);
            }
        }
    };
    BABYLON.FreeCamera.prototype._checkInputs = function () {
        if (!this._localDirection) {
            this._localDirection = BABYLON.Vector3.Zero();
            this._transformedDirection = BABYLON.Vector3.Zero();
        }
        for (var index = 0; index < this._keys.length; index++) {
            var keyCode = this._keys[index];
            var speed = this._computeLocalCameraSpeed();
            if (this.keysLeft.indexOf(keyCode) !== -1) {
                this._localDirection.copyFromFloats(-speed, 0, 0);
            } else if (this.keysUp.indexOf(keyCode) !== -1) {
                this._localDirection.copyFromFloats(0, 0, speed);
            } else if (this.keysRight.indexOf(keyCode) !== -1) {
                this._localDirection.copyFromFloats(speed, 0, 0);
            } else if (this.keysDown.indexOf(keyCode) !== -1) {
                this._localDirection.copyFromFloats(0, 0, -speed);
            }
            this.getViewMatrix().invertToRef(this._cameraTransformMatrix);
            BABYLON.Vector3.TransformNormalToRef(this._localDirection, this._cameraTransformMatrix, this._transformedDirection);
            this.cameraDirection.addInPlace(this._transformedDirection);
        }
    };
    BABYLON.FreeCamera.prototype._update = function () {
        this._checkInputs();
        var needToMove = this._needMoveForGravity || Math.abs(this.cameraDirection.x) > 0 || Math.abs(this.cameraDirection.y) > 0 || Math.abs(this.cameraDirection.z) > 0;
        var needToRotate = Math.abs(this.cameraRotation.x) > 0 || Math.abs(this.cameraRotation.y) > 0;

        /////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////

        if (this.checkCollisions && this._scene.collisionsEnabled && this.applyGravity) {
            var oldPosition = this.position;
            this._collideWithWorld(this._scene.gravity);
            this._needMoveForGravity = (BABYLON.Vector3.DistanceSquared(oldPosition, this.position) != 0);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////

        if (needToMove) {
            if (this.checkCollisions && this._scene.collisionsEnabled) {
                this._collideWithWorld(this.cameraDirection);
            } else {
                this.position.addInPlace(this.cameraDirection);
            }
        }
        if (needToRotate) {
            this.rotation.x += this.cameraRotation.x;
            this.rotation.y += this.cameraRotation.y;
            if (!this.noRotationConstraint) {
                var limit = (Math.PI / 2) * 0.95;
                if (this.rotation.x > limit) this.rotation.x = limit;
                if (this.rotation.x < -limit) this.rotation.x = -limit;
            }
        }
        if (needToMove) {
            if (Math.abs(this.cameraDirection.x) < BABYLON.Engine.epsilon) this.cameraDirection.x = 0;
            if (Math.abs(this.cameraDirection.y) < BABYLON.Engine.epsilon) this.cameraDirection.y = 0;
            if (Math.abs(this.cameraDirection.z) < BABYLON.Engine.epsilon) this.cameraDirection.z = 0;
            this.cameraDirection.scaleInPlace(this.inertia);
        }
        if (needToRotate) {
            if (Math.abs(this.cameraRotation.x) < BABYLON.Engine.epsilon) this.cameraRotation.x = 0;
            if (Math.abs(this.cameraRotation.y) < BABYLON.Engine.epsilon) this.cameraRotation.y = 0;
            this.cameraRotation.scaleInPlace(this.inertia);
        }
    };
    BABYLON.FreeCamera.prototype._getViewMatrix = function () {
        BABYLON.Vector3.FromFloatsToRef(0, 0, 1, this._referencePoint);
        if (!this.lockedTarget) {
            if (this.upVector.x != 0 || this.upVector.y != 1.0 || this.upVector.z != 0) {
                BABYLON.Matrix.LookAtLHToRef(BABYLON.Vector3.Zero(), this._referencePoint, this.upVector, this._lookAtTemp);
                BABYLON.Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this._cameraRotationMatrix);
                this._lookAtTemp.multiplyToRef(this._cameraRotationMatrix, this._tempMatrix);
                this._lookAtTemp.invert();
                this._tempMatrix.multiplyToRef(this._lookAtTemp, this._cameraRotationMatrix);
            } else {
                BABYLON.Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this._cameraRotationMatrix);
            }
            BABYLON.Vector3.TransformCoordinatesToRef(this._referencePoint, this._cameraRotationMatrix, this._transformedReferencePoint);
            this.position.addToRef(this._transformedReferencePoint, this._currentTarget);
        } else {
            this._currentTarget.copyFrom(this._getLockedTargetPosition());
        }
        BABYLON.Matrix.LookAtLHToRef(this.position, this._currentTarget, this.upVector, this._viewMatrix);
        return this._viewMatrix;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.TouchCamera = function (name, position, scene) {
        BABYLON.FreeCamera.call(this, name, position, scene);
        this._offsetX = null;
        this._offsetY = null;
        this._pointerCount = 0;
        this._pointerPressed = [];
    };
    BABYLON.TouchCamera.prototype = Object.create(BABYLON.FreeCamera.prototype);
    BABYLON.TouchCamera.prototype.angularSensibility = 200000.0;
    BABYLON.TouchCamera.prototype.moveSensibility = 500.0;
    BABYLON.TouchCamera.prototype.attachControl = function (canvas, noPreventDefault) {
        var previousPosition;
        var that = this;
        if (this._attachedCanvas) {
            return;
        }
        this._attachedCanvas = canvas;
        if (this._onPointerDown === undefined) {
            this._onPointerDown = function (evt) {
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
                that._pointerPressed.push(evt.pointerId);
                if (that._pointerPressed.length !== 1) {
                    return;
                }
                previousPosition = {
                    x: evt.clientX,
                    y: evt.clientY
                };
            };
            this._onPointerUp = function (evt) {
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
                var index = that._pointerPressed.indexOf(evt.pointerId);
                if (index === -1) {
                    return;
                }
                that._pointerPressed.splice(index, 1);
                if (index != 0) {
                    return;
                }
                previousPosition = null;
                that._offsetX = null;
                that._offsetY = null;
            };
            this._onPointerMove = function (evt) {
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
                if (!previousPosition) {
                    return;
                }
                var index = that._pointerPressed.indexOf(evt.pointerId);
                if (index != 0) {
                    return;
                }
                that._offsetX = evt.clientX - previousPosition.x;
                that._offsetY = -(evt.clientY - previousPosition.y);
            };
            this._onLostFocus = function () {
                that._offsetX = null;
                that._offsetY = null;
            };
        }
        canvas.addEventListener("pointerdown", this._onPointerDown);
        canvas.addEventListener("pointerup", this._onPointerUp);
        canvas.addEventListener("pointerout", this._onPointerUp);
        canvas.addEventListener("pointermove", this._onPointerMove);
        window.addEventListener("blur", this._onLostFocus);
    };
    BABYLON.TouchCamera.prototype.detachControl = function (canvas) {
        if (this._attachedCanvas != canvas) {
            return;
        }
        canvas.removeEventListener("pointerdown", this._onPointerDown);
        canvas.removeEventListener("pointerup", this._onPointerUp);
        canvas.removeEventListener("pointerout", this._onPointerUp);
        canvas.removeEventListener("pointermove", this._onPointerMove);
        window.removeEventListener("blur", this._onLostFocus);
        this._attachedCanvas = null;
    };
    BABYLON.TouchCamera.prototype._checkInputs = function () {
        if (!this._offsetX) {
            return;
        }
        this.cameraRotation.y += this._offsetX / this.angularSensibility;
        if (this._pointerPressed.length > 1) {
            this.cameraRotation.x += -this._offsetY / this.angularSensibility;
        } else {
            var speed = this._computeLocalCameraSpeed();
            var direction = new BABYLON.Vector3(0, 0, speed * this._offsetY / this.moveSensibility);
            BABYLON.Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, 0, this._cameraRotationMatrix);
            this.cameraDirection.addInPlace(BABYLON.Vector3.TransformCoordinates(direction, this._cameraRotationMatrix));
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.DeviceOrientationCamera = function (name, position, scene) {
        BABYLON.FreeCamera.call(this, name, position, scene);
        this._offsetX = null;
        this._offsetY = null;
        this._orientationGamma = 0;
        this._orientationBeta = 0;
        this._initialOrientationGamma = 0;
        this._initialOrientationBeta = 0;
    };
    BABYLON.DeviceOrientationCamera.prototype = Object.create(BABYLON.FreeCamera.prototype);
    BABYLON.DeviceOrientationCamera.prototype.angularSensibility = 10000.0;
    BABYLON.DeviceOrientationCamera.prototype.moveSensibility = 50.0;
    BABYLON.DeviceOrientationCamera.prototype.attachControl = function (canvas, noPreventDefault) {
        if (this._attachedCanvas) {
            return;
        }
        this._attachedCanvas = canvas;
        var that = this;
        if (!this._orientationChanged) {
            this._orientationChanged = function (evt) {
                if (!that._initialOrientationGamma) {
                    that._initialOrientationGamma = evt.gamma;
                    that._initialOrientationBeta = evt.beta;
                }
                that._orientationGamma = evt.gamma;
                that._orientationBeta = evt.beta;
                that._offsetY = (that._initialOrientationBeta - that._orientationBeta);
                that._offsetX = (that._initialOrientationGamma - that._orientationGamma);
            };
        }
        window.addEventListener("deviceorientation", this._orientationChanged);
    };
    BABYLON.DeviceOrientationCamera.prototype.detachControl = function (canvas) {
        if (this._attachedCanvas != canvas) {
            return;
        }
        window.removeEventListener("deviceorientation", this._orientationChanged);
        this._attachedCanvas = null;
        this._orientationGamma = 0;
        this._orientationBeta = 0;
        this._initialOrientationGamma = 0;
        this._initialOrientationBeta = 0;
    };
    BABYLON.DeviceOrientationCamera.prototype._checkInputs = function () {
        if (!this._offsetX) {
            return;
        }
        this.cameraRotation.y -= this._offsetX / this.angularSensibility;
        var speed = this._computeLocalCameraSpeed();
        var direction = new BABYLON.Vector3(0, 0, speed * this._offsetY / this.moveSensibility);
        BABYLON.Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, 0, this._cameraRotationMatrix);
        this.cameraDirection.addInPlace(BABYLON.Vector3.TransformCoordinates(direction, this._cameraRotationMatrix));
    };
})();
var BABYLON = BABYLON || {};
(function () {
    var eventPrefix = BABYLON.Tools.GetPointerPrefix();
    BABYLON.ArcRotateCamera = function (name, alpha, beta, radius, target, scene) {
        BABYLON.Camera.call(this, name, BABYLON.Vector3.Zero(), scene);
        this.alpha = alpha;
        this.beta = beta;
        this.radius = radius;
        this.target = target;
        this._keys = [];
        this.keysUp = [38];
        this.keysDown = [40];
        this.keysLeft = [37];
        this.keysRight = [39];
        this._viewMatrix = new BABYLON.Matrix();
        BABYLON.ArcRotateCamera.prototype._initCache.call(this);
        this.getViewMatrix();
    };
    BABYLON.ArcRotateCamera.prototype = Object.create(BABYLON.Camera.prototype);
    BABYLON.ArcRotateCamera.prototype.inertialAlphaOffset = 0;
    BABYLON.ArcRotateCamera.prototype.inertialBetaOffset = 0;
    BABYLON.ArcRotateCamera.prototype.inertialRadiusOffset = 0;
    BABYLON.ArcRotateCamera.prototype.lowerAlphaLimit = null;
    BABYLON.ArcRotateCamera.prototype.upperAlphaLimit = null;
    BABYLON.ArcRotateCamera.prototype.lowerBetaLimit = 0.01;
    BABYLON.ArcRotateCamera.prototype.upperBetaLimit = Math.PI;
    BABYLON.ArcRotateCamera.prototype.lowerRadiusLimit = null;
    BABYLON.ArcRotateCamera.prototype.upperRadiusLimit = null;
    BABYLON.ArcRotateCamera.prototype.angularSensibility = 1000.0;
    BABYLON.ArcRotateCamera.prototype.wheelPrecision = 3.0;
    BABYLON.ArcRotateCamera.prototype._getTargetPosition = function () {
        return this.target.position || this.target;
    };
    BABYLON.ArcRotateCamera.prototype._initCache = function () {
        this._cache.target = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        this._cache.alpha = undefined;
        this._cache.beta = undefined;
        this._cache.radius = undefined;
    };
    BABYLON.ArcRotateCamera.prototype._updateCache = function (ignoreParentClass) {
        if (!ignoreParentClass) BABYLON.Camera.prototype._updateCache.call(this);
        this._cache.target.copyFrom(this._getTargetPosition());
        this._cache.alpha = this.alpha;
        this._cache.beta = this.beta;
        this._cache.radius = this.radius;
    };
    BABYLON.ArcRotateCamera.prototype._isSynchronizedViewMatrix = function () {
        if (!BABYLON.Camera.prototype._isSynchronizedViewMatrix.call(this)) return false;
        return this._cache.target.equals(this._getTargetPosition()) && this._cache.alpha === this.alpha && this._cache.beta === this.beta && this._cache.radius === this.radius;
    };
    BABYLON.ArcRotateCamera.prototype.attachControl = function (canvas, noPreventDefault) {
        var previousPosition;
        var that = this;
        var pointerId;
        if (this._attachedCanvas) {
            return;
        }
        this._attachedCanvas = canvas;
        var engine = this._scene.getEngine();
        if (this._onPointerDown === undefined) {
            this._onPointerDown = function (evt) {
                if (pointerId) {
                    return;
                }
                pointerId = evt.pointerId;
                previousPosition = {
                    x: evt.clientX,
                    y: evt.clientY
                };
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };
            this._onPointerUp = function (evt) {
                previousPosition = null;
                pointerId = null;
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };
            this._onPointerMove = function (evt) {
                if (!previousPosition) {
                    return;
                }
                if (pointerId !== evt.pointerId) {
                    return;
                }
                var offsetX = evt.clientX - previousPosition.x;
                var offsetY = evt.clientY - previousPosition.y;
                that.inertialAlphaOffset -= offsetX / that.angularSensibility;
                that.inertialBetaOffset -= offsetY / that.angularSensibility;
                previousPosition = {
                    x: evt.clientX,
                    y: evt.clientY
                };
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };
            this._onMouseMove = function (evt) {
                if (!engine.isPointerLock) {
                    return;
                }
                var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
                var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
                that.inertialAlphaOffset -= offsetX / that.angularSensibility;
                that.inertialBetaOffset -= offsetY / that.angularSensibility;
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            };
            this._wheel = function (event) {
                var delta = 0;
                if (event.wheelDelta) {
                    delta = event.wheelDelta / (that.wheelPrecision * 40);
                } else if (event.detail) {
                    delta = -event.detail / that.wheelPrecision;
                }
                if (delta) that.inertialRadiusOffset += delta;
                if (event.preventDefault) {
                    if (!noPreventDefault) {
                        event.preventDefault();
                    }
                }
            };
            this._onKeyDown = function (evt) {
                if (that.keysUp.indexOf(evt.keyCode) !== -1 || that.keysDown.indexOf(evt.keyCode) !== -1 || that.keysLeft.indexOf(evt.keyCode) !== -1 || that.keysRight.indexOf(evt.keyCode) !== -1) {
                    var index = that._keys.indexOf(evt.keyCode);
                    if (index === -1) {
                        that._keys.push(evt.keyCode);
                    }
                    if (evt.preventDefault) {
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                }
            };
            this._onKeyUp = function (evt) {
                if (that.keysUp.indexOf(evt.keyCode) !== -1 || that.keysDown.indexOf(evt.keyCode) !== -1 || that.keysLeft.indexOf(evt.keyCode) !== -1 || that.keysRight.indexOf(evt.keyCode) !== -1) {
                    var index = that._keys.indexOf(evt.keyCode);
                    if (index >= 0) {
                        that._keys.splice(index, 1);
                    }
                    if (evt.preventDefault) {
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                }
            };
            this._onLostFocus = function () {
                that._keys = [];
                pointerId = null;
            };
            this._onGestureStart = function (e) {
                if (window.MSGesture === undefined) {
                    return;
                }
                if (!that._MSGestureHandler) {
                    that._MSGestureHandler = new MSGesture();
                    that._MSGestureHandler.target = canvas;
                }
                that._MSGestureHandler.addPointer(e.pointerId);
            };
            this._onGesture = function (e) {
                that.radius *= e.scale;
                if (e.preventDefault) {
                    if (!noPreventDefault) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            };
            this._reset = function () {
                that._keys = [];
                that.inertialAlphaOffset = 0;
                that.inertialBetaOffset = 0;
                previousPosition = null;
                pointerId = null;
            };
        }
        canvas.addEventListener(eventPrefix + "down", this._onPointerDown, false);
        canvas.addEventListener(eventPrefix + "up", this._onPointerUp, false);
        canvas.addEventListener(eventPrefix + "out", this._onPointerUp, false);
        canvas.addEventListener(eventPrefix + "move", this._onPointerMove, false);
        canvas.addEventListener("mousemove", this._onMouseMove, false);
        canvas.addEventListener("MSPointerDown", this._onGestureStart, false);
        canvas.addEventListener("MSGestureChange", this._onGesture, false);
        window.addEventListener("keydown", this._onKeyDown, false);
        window.addEventListener("keyup", this._onKeyUp, false);
        window.addEventListener('mousewheel', this._wheel, false);
        window.addEventListener('DOMMouseScroll', this._wheel, false);
        window.addEventListener("blur", this._onLostFocus, false);
    };
    BABYLON.ArcRotateCamera.prototype.detachControl = function (canvas) {
        if (this._attachedCanvas != canvas) {
            return;
        }
        canvas.removeEventListener(eventPrefix + "down", this._onPointerDown);
        canvas.removeEventListener(eventPrefix + "up", this._onPointerUp);
        canvas.removeEventListener(eventPrefix + "out", this._onPointerUp);
        canvas.removeEventListener(eventPrefix + "move", this._onPointerMove);
        canvas.removeEventListener("mousemove", this._onMouseMove);
        canvas.removeEventListener("MSPointerDown", this._onGestureStart);
        canvas.removeEventListener("MSGestureChange", this._onGesture);
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
        window.removeEventListener('mousewheel', this._wheel);
        window.removeEventListener('DOMMouseScroll', this._wheel);
        window.removeEventListener("blur", this._onLostFocus);
        this._MSGestureHandler = null;
        this._attachedCanvas = null;
        if (this._reset) {
            this._reset();
        }
    };
    BABYLON.ArcRotateCamera.prototype._update = function () {
        for (var index = 0; index < this._keys.length; index++) {
            var keyCode = this._keys[index];
            if (this.keysLeft.indexOf(keyCode) !== -1) {
                this.inertialAlphaOffset -= 0.01;
            } else if (this.keysUp.indexOf(keyCode) !== -1) {
                this.inertialBetaOffset -= 0.01;
            } else if (this.keysRight.indexOf(keyCode) !== -1) {
                this.inertialAlphaOffset += 0.01;
            } else if (this.keysDown.indexOf(keyCode) !== -1) {
                this.inertialBetaOffset += 0.01;
            }
        }
        if (this.inertialAlphaOffset != 0 || this.inertialBetaOffset != 0 || this.inertialRadiusOffset != 0) {
            this.alpha += this.inertialAlphaOffset;
            this.beta += this.inertialBetaOffset;
            this.radius -= this.inertialRadiusOffset;
            this.inertialAlphaOffset *= this.inertia;
            this.inertialBetaOffset *= this.inertia;
            this.inertialRadiusOffset *= this.inertia;
            if (Math.abs(this.inertialAlphaOffset) < BABYLON.Engine.epsilon) this.inertialAlphaOffset = 0;
            if (Math.abs(this.inertialBetaOffset) < BABYLON.Engine.epsilon) this.inertialBetaOffset = 0;
            if (Math.abs(this.inertialRadiusOffset) < BABYLON.Engine.epsilon) this.inertialRadiusOffset = 0;
        }
        if (this.lowerAlphaLimit && this.alpha < this.lowerAlphaLimit) {
            this.alpha = this.lowerAlphaLimit;
        }
        if (this.upperAlphaLimit && this.alpha > this.upperAlphaLimit) {
            this.alpha = this.upperAlphaLimit;
        }
        if (this.lowerBetaLimit && this.beta < this.lowerBetaLimit) {
            this.beta = this.lowerBetaLimit;
        }
        if (this.upperBetaLimit && this.beta > this.upperBetaLimit) {
            this.beta = this.upperBetaLimit;
        }
        if (this.lowerRadiusLimit && this.radius < this.lowerRadiusLimit) {
            this.radius = this.lowerRadiusLimit;
        }
        if (this.upperRadiusLimit && this.radius > this.upperRadiusLimit) {
            this.radius = this.upperRadiusLimit;
        }
    };
    BABYLON.ArcRotateCamera.prototype.setPosition = function (position) {
        var radiusv3 = position.subtract(this._getTargetPosition());
        this.radius = radiusv3.length();
        this.alpha = Math.atan(radiusv3.z / radiusv3.x);
        this.beta = Math.acos(radiusv3.y / this.radius);
    };
    BABYLON.ArcRotateCamera.prototype._getViewMatrix = function () {
        var cosa = Math.cos(this.alpha);
        var sina = Math.sin(this.alpha);
        var cosb = Math.cos(this.beta);
        var sinb = Math.sin(this.beta);
        var target = this._getTargetPosition();
        target.addToRef(new BABYLON.Vector3(this.radius * cosa * sinb, this.radius * cosb, this.radius * sina * sinb), this.position);
        BABYLON.Matrix.LookAtLHToRef(this.position, target, this.upVector, this._viewMatrix);
        return this._viewMatrix;
    };
    BABYLON.ArcRotateCamera.ZOOM_ON_FACTOR = 1;
    BABYLON.ArcRotateCamera.prototype.zoomOn = function (meshes) {
        meshes = meshes || this._scene.meshes;
        var minMaxVector = BABYLON.Mesh.MinMax(meshes);
        var distance = BABYLON.Vector3.Distance(minMaxVector.min, minMaxVector.max);
        this.radius = distance * BABYLON.ArcRotateCamera.ZOOM_ON_FACTOR;
        this.focusOn({
            min: minMaxVector.min,
            max: minMaxVector.max,
            distance: distance
        });
    };
    BABYLON.ArcRotateCamera.prototype.focusOn = function (meshesOrMinMaxVectorAndDistance) {
        var meshesOrMinMaxVector;
        var distance;
        if (meshesOrMinMaxVectorAndDistance.min === undefined) {
            meshesOrMinMaxVector = meshesOrMinMaxVectorAndDistance || this._scene.meshes;
            meshesOrMinMaxVector = BABYLON.Mesh.MinMax(meshesOrMinMaxVector);
            distance = BABYLON.Vector3.Distance(meshesOrMinMaxVector.min, meshesOrMinMaxVector.max);
        } else {
            meshesOrMinMaxVector = meshesOrMinMaxVectorAndDistance;
            distance = meshesOrMinMaxVectorAndDistance.distance;
        }
        this.target = BABYLON.Mesh.Center(meshesOrMinMaxVector);
        this.maxZ = distance * 2;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Scene = function (engine) {
        this._engine = engine;
        this.autoClear = true;
        this.clearColor = new BABYLON.Color3(0.2, 0.2, 0.3);
        this.ambientColor = new BABYLON.Color3(0, 0, 0);
        engine.scenes.push(this);
        this._totalVertices = 0;
        this._activeVertices = 0;
        this._activeParticles = 0;
        this._lastFrameDuration = 0;
        this._evaluateActiveMeshesDuration = 0;
        this._renderTargetsDuration = 0;
        this._renderDuration = 0;
        this._renderId = 0;
        this._executeWhenReadyTimeoutId = -1;
        this._toBeDisposed = new BABYLON.Tools.SmartArray(256);
        this._onReadyCallbacks = [];
        this._pendingData = [];
        this._onBeforeRenderCallbacks = [];
        this.fogMode = BABYLON.Scene.FOGMODE_NONE;
        this.fogColor = new BABYLON.Color3(0.2, 0.2, 0.3);
        this.fogDensity = 0.1;
        this.fogStart = 0;
        this.fogEnd = 1000.0;
        this.lightsEnabled = true;
        this.lights = [];
        this.cameras = [];
        this.activeCamera = null;
        this.meshes = [];
        this._activeMeshes = new BABYLON.Tools.SmartArray(256);
        this._processedMaterials = new BABYLON.Tools.SmartArray(256);
        this._renderTargets = new BABYLON.Tools.SmartArray(256);
        this._activeParticleSystems = new BABYLON.Tools.SmartArray(256);
        this._activeSkeletons = new BABYLON.Tools.SmartArray(32);
        this._renderingManager = new BABYLON.RenderingManager(this);
        this.materials = [];
        this.multiMaterials = [];
        this.defaultMaterial = new BABYLON.StandardMaterial("default material", this);
        this.texturesEnabled = true;
        this.textures = [];
        this.particlesEnabled = true;
        this.particleSystems = [];
        this.spriteManagers = [];
        this.layers = [];
        this.skeletons = [];
        this.lensFlareSystems = [];
        this.collisionsEnabled = true;
        this.gravity = new BABYLON.Vector3(0, -9.0, 0);
        this._activeAnimatables = [];
        this._transformMatrix = BABYLON.Matrix.Zero();
        this._scaledPosition = BABYLON.Vector3.Zero();
        this._scaledVelocity = BABYLON.Vector3.Zero();
        this.postProcessesEnabled = true;
        this.postProcessManager = new BABYLON.PostProcessManager(this);
        this.renderTargetsEnabled = true;
        this.customRenderTargets = [];
        this.activeCameras = [];
    };
    BABYLON.Scene.prototype.getEngine = function () {
        return this._engine;
    };
    BABYLON.Scene.prototype.getTotalVertices = function () {
        return this._totalVertices;
    };
    BABYLON.Scene.prototype.getActiveVertices = function () {
        return this._activeVertices;
    };
    BABYLON.Scene.prototype.getActiveParticles = function () {
        return this._activeParticles;
    };
    BABYLON.Scene.prototype.getLastFrameDuration = function () {
        return this._lastFrameDuration;
    };
    BABYLON.Scene.prototype.getEvaluateActiveMeshesDuration = function () {
        return this._evaluateActiveMeshesDuration;
    };
    BABYLON.Scene.prototype.getActiveMeshes = function () {
        return this._activeMeshes;
    };
    BABYLON.Scene.prototype.getRenderTargetsDuration = function () {
        return this._renderTargetsDuration;
    };
    BABYLON.Scene.prototype.getRenderDuration = function () {
        return this._renderDuration;
    };
    BABYLON.Scene.prototype.getParticlesDuration = function () {
        return this._particlesDuration;
    };
    BABYLON.Scene.prototype.getSpritesDuration = function () {
        return this._spritesDuration;
    };
    BABYLON.Scene.prototype.getAnimationRatio = function () {
        return this._animationRatio;
    };
    BABYLON.Scene.prototype.getRenderId = function () {
        return this._renderId;
    };
    BABYLON.Scene.prototype.isReady = function () {
        if (this._pendingData.length > 0) {
            return false;
        }
        for (var index = 0; index < this.meshes.length; index++) {
            var mesh = this.meshes[index];
            var mat = mesh.material;
            if (mesh.delayLoadState === BABYLON.Engine.DELAYLOADSTATE_LOADING) {
                return false;
            }
            if (mat) {
                if (!mat.isReady(mesh)) {
                    return false;
                }
            }
        }
        return true;
    };
    BABYLON.Scene.prototype.registerBeforeRender = function (func) {
        this._onBeforeRenderCallbacks.push(func);
    };
    BABYLON.Scene.prototype.unregisterBeforeRender = function (func) {
        var index = this._onBeforeRenderCallbacks.indexOf(func);
        if (index > -1) {
            this._onBeforeRenderCallbacks.splice(index, 1);
        }
    };
    BABYLON.Scene.prototype._addPendingData = function (data) {
        this._pendingData.push(data);
    };
    BABYLON.Scene.prototype._removePendingData = function (data) {
        var index = this._pendingData.indexOf(data);
        if (index !== -1) {
            this._pendingData.splice(index, 1);
        }
    };
    BABYLON.Scene.prototype.getWaitingItemsCount = function () {
        return this._pendingData.length;
    };
    BABYLON.Scene.prototype.executeWhenReady = function (func) {
        this._onReadyCallbacks.push(func);
        if (this._executeWhenReadyTimeoutId !== -1) {
            return;
        }
        var that = this;
        this._executeWhenReadyTimeoutId = setTimeout(function () {
            that._checkIsReady();
        }, 150);
    };
    BABYLON.Scene.prototype._checkIsReady = function () {
        if (this.isReady()) {
            this._onReadyCallbacks.forEach(function (func) {
                func();
            });
            this._onReadyCallbacks = [];
            this._executeWhenReadyTimeoutId = -1;
            return;
        }
        var that = this;
        this._executeWhenReadyTimeoutId = setTimeout(function () {
            that._checkIsReady();
        }, 150);
    };
    BABYLON.Scene.prototype.beginAnimation = function (target, from, to, loop, speedRatio, onAnimationEnd) {
        if (speedRatio === undefined) {
            speedRatio = 1.0;
        }
        if (target.animations) {
            this.stopAnimation(target);
            var animatable = new BABYLON._Animatable(target, from, to, loop, speedRatio, onAnimationEnd);
            this._activeAnimatables.push(animatable);
        }
        if (target.getAnimatables) {
            var animatables = target.getAnimatables();
            for (var index = 0; index < animatables.length; index++) {
                this.beginAnimation(animatables[index], from, to, loop, speedRatio, onAnimationEnd);
            }
        }
    };
    BABYLON.Scene.prototype.stopAnimation = function (target) {
        if (target.animations) {
            for (var index = 0; index < this._activeAnimatables.length; index++) {
                if (this._activeAnimatables[index].target === target) {
                    this._activeAnimatables.splice(index, 1);
                    return;
                }
            }
        }
        if (target.getAnimatables) {
            var animatables = target.getAnimatables();
            for (var index = 0; index < animatables.length; index++) {
                this.stopAnimation(animatables[index]);
            }
        }
    };
    BABYLON.Scene.prototype._animate = function () {
        if (!this._animationStartDate) {
            this._animationStartDate = new Date();
        }
        var now = new Date();
        var delay = now - this._animationStartDate;
        for (var index = 0; index < this._activeAnimatables.length; index++) {
            if (!this._activeAnimatables[index]._animate(delay)) {
                this._activeAnimatables.splice(index, 1);
                index--;
            }
        }
    };
    BABYLON.Scene.prototype.getViewMatrix = function () {
        return this._viewMatrix;
    };
    BABYLON.Scene.prototype.getProjectionMatrix = function () {
        return this._projectionMatrix;
    };
    BABYLON.Scene.prototype.getTransformMatrix = function () {
        return this._transformMatrix;
    };
    BABYLON.Scene.prototype.setTransformMatrix = function (view, projection) {
        this._viewMatrix = view;
        this._projectionMatrix = projection;
        this._viewMatrix.multiplyToRef(this._projectionMatrix, this._transformMatrix);
    };
    BABYLON.Scene.prototype.setActiveCameraByID = function (id) {
        var camera = this.getCameraByID(id);
        if (camera) {
            this.activeCamera = camera;
            return camera;
        }
        return null;
    };
    BABYLON.Scene.prototype.setActiveCameraByName = function (name) {
        var camera = this.getCameraByName(name);
        if (camera) {
            this.activeCamera = camera;
            return camera;
        }
        return null;
    };
    BABYLON.Scene.prototype.getMaterialByID = function (id) {
        for (var index = 0; index < this.materials.length; index++) {
            if (this.materials[index].id === id) {
                return this.materials[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.getMaterialByName = function (name) {
        for (var index = 0; index < this.materials.length; index++) {
            if (this.materials[index].name === name) {
                return this.materials[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.getCameraByID = function (id) {
        for (var index = 0; index < this.cameras.length; index++) {
            if (this.cameras[index].id === id) {
                return this.cameras[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.getCameraByName = function (name) {
        for (var index = 0; index < this.cameras.length; index++) {
            if (this.cameras[index].name === name) {
                return this.cameras[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.getLightByID = function (id) {
        for (var index = 0; index < this.lights.length; index++) {
            if (this.lights[index].id === id) {
                return this.lights[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.getMeshByID = function (id) {
        for (var index = 0; index < this.meshes.length; index++) {
            if (this.meshes[index].id === id) {
                return this.meshes[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.getLastMeshByID = function (id) {
        for (var index = this.meshes.length - 1; index >= 0; index--) {
            if (this.meshes[index].id === id) {
                return this.meshes[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.getLastEntryByID = function (id) {
        for (var index = this.meshes.length - 1; index >= 0; index--) {
            if (this.meshes[index].id === id) {
                return this.meshes[index];
            }
        }
        for (var index = this.cameras.length - 1; index >= 0; index--) {
            if (this.cameras[index].id === id) {
                return this.cameras[index];
            }
        }
        for (var index = this.lights.length - 1; index >= 0; index--) {
            if (this.lights[index].id === id) {
                return this.lights[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.getMeshByName = function (name) {
        for (var index = 0; index < this.meshes.length; index++) {
            if (this.meshes[index].name === name) {
                return this.meshes[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.getLastSkeletonByID = function (id) {
        for (var index = this.skeletons.length - 1; index >= 0; index--) {
            if (this.skeletons[index].id === id) {
                return this.skeletons[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.getSkeletonById = function (id) {
        for (var index = 0; index < this.skeletons.length; index++) {
            if (this.skeletons[index].id === id) {
                return this.skeletons[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.getSkeletonByName = function (name) {
        for (var index = 0; index < this.skeleton.length; index++) {
            if (this.skeletons[index].name === name) {
                return this.skeletons[index];
            }
        }
        return null;
    };
    BABYLON.Scene.prototype.isActiveMesh = function (mesh) {
        return (this._activeMeshes.indexOf(mesh) !== -1);
    };
    BABYLON.Scene.prototype._evaluateSubMesh = function (subMesh, mesh) {
        if (mesh.subMeshes.length == 1 || subMesh.isInFrustum(this._frustumPlanes)) {
            var material = subMesh.getMaterial();
            if (material) {
                if (material.getRenderTargetTextures) {
                    if (this._processedMaterials.indexOf(material) === -1) {
                        this._processedMaterials.push(material);
                        this._renderTargets.concat(material.getRenderTargetTextures());
                    }
                }
                this._activeVertices += subMesh.verticesCount;
                this._renderingManager.dispatch(subMesh);
            }
        }
    };
    BABYLON.Scene.prototype._evaluateActiveMeshes = function () {
        this._activeMeshes.reset();
        this._renderingManager.reset();
        this._processedMaterials.reset();
        this._activeParticleSystems.reset();
        this._activeSkeletons.reset();
        if (!this._frustumPlanes) {
            this._frustumPlanes = BABYLON.Frustum.GetPlanes(this._transformMatrix);
        } else {
            BABYLON.Frustum.GetPlanesToRef(this._transformMatrix, this._frustumPlanes);
        } if (this._selectionOctree) {
            var selection = this._selectionOctree.select(this._frustumPlanes);
            for (var blockIndex = 0; blockIndex < selection.length; blockIndex++) {
                var block = selection.data[blockIndex];
                for (var meshIndex = 0; meshIndex < block.meshes.length; meshIndex++) {
                    var mesh = block.meshes[meshIndex];
                    if (Math.abs(mesh._renderId) !== this._renderId) {
                        this._totalVertices += mesh.getTotalVertices();
                        if (!mesh.isReady()) {
                            continue;
                        }
                        mesh.computeWorldMatrix();
                        mesh._renderId = 0;
                    }
                    if (mesh._renderId === this._renderId || (mesh._renderId === 0 && mesh.isEnabled() && mesh.isVisible && mesh.visibility > 0 && mesh.isInFrustum(this._frustumPlanes))) {
                        if (mesh._renderId === 0) {
                            this._activeMeshes.push(mesh);
                        }
                        mesh._renderId = this._renderId;
                        if (mesh.skeleton) {
                            this._activeSkeletons.pushNoDuplicate(mesh.skeleton);
                        }
                        var subMeshes = block.subMeshes[meshIndex];
                        for (var subIndex = 0; subIndex < subMeshes.length; subIndex++) {
                            var subMesh = subMeshes[subIndex];
                            if (subMesh._renderId === this._renderId) {
                                continue;
                            }
                            subMesh._renderId = this._renderId;
                            this._evaluateSubMesh(subMesh, mesh);
                        }
                    } else {
                        mesh._renderId = -this._renderId;
                    }
                }
            }
        } else {
            for (var meshIndex = 0; meshIndex < this.meshes.length; meshIndex++) {
                var mesh = this.meshes[meshIndex];
                this._totalVertices += mesh.getTotalVertices();
                if (!mesh.isReady()) {
                    continue;
                }
                mesh.computeWorldMatrix();
                if (mesh.isEnabled() && mesh.isVisible && mesh.visibility > 0 && mesh.isInFrustum(this._frustumPlanes)) {
                    this._activeMeshes.push(mesh);
                    if (mesh.skeleton) {
                        this._activeSkeletons.pushNoDuplicate(mesh.skeleton);
                    }
                    for (var subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
                        var subMesh = mesh.subMeshes[subIndex];
                        this._evaluateSubMesh(subMesh, mesh);
                    }
                }
            }
        }
        var beforeParticlesDate = new Date();
        if (this.particlesEnabled) {
            for (var particleIndex = 0; particleIndex < this.particleSystems.length; particleIndex++) {
                var particleSystem = this.particleSystems[particleIndex];
                if (!particleSystem.emitter.position || (particleSystem.emitter && particleSystem.emitter.isEnabled())) {
                    this._activeParticleSystems.push(particleSystem);
                    particleSystem.animate();
                }
            }
        }
        this._particlesDuration += new Date() - beforeParticlesDate;
    };
    BABYLON.Scene.prototype._renderForCamera = function (camera, mustClearDepth) {
        var engine = this._engine;
        this.activeCamera = camera;
        if (!this.activeCamera) throw new Error("Active camera not set");
        engine.setViewport(this.activeCamera.viewport);
        if (mustClearDepth) {
            this._engine.clear(this.clearColor, false, true);
        }
        this._renderId++;
        this.setTransformMatrix(this.activeCamera.getViewMatrix(), this.activeCamera.getProjectionMatrix());
        var beforeEvaluateActiveMeshesDate = new Date();
        this._evaluateActiveMeshes();
        this._evaluateActiveMeshesDuration += new Date() - beforeEvaluateActiveMeshesDate;
        for (var skeletonIndex = 0; skeletonIndex < this._activeSkeletons.length; skeletonIndex++) {
            var skeleton = this._activeSkeletons.data[skeletonIndex];
            skeleton.prepare();
        }
        for (var customIndex = 0; customIndex < this.customRenderTargets.length; customIndex++) {
            this._renderTargets.push(this.customRenderTargets[customIndex]);
        }
        var beforeRenderTargetDate = new Date();
        if (this.renderTargetsEnabled) {
            for (var renderIndex = 0; renderIndex < this._renderTargets.length; renderIndex++) {
                var renderTarget = this._renderTargets.data[renderIndex];
                this._renderId++;
                renderTarget.render();
            }
        }
        if (this._renderTargets.length > 0) {
            engine.restoreDefaultFramebuffer();
        }
        this._renderTargetsDuration = new Date() - beforeRenderTargetDate;
        this.postProcessManager._prepareFrame();
        var beforeRenderDate = new Date();
        if (this.layers.length) {
            engine.setDepthBuffer(false);
            var layerIndex;
            var layer;
            for (layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
                layer = this.layers[layerIndex];
                if (layer.isBackground) {
                    layer.render();
                }
            }
            engine.setDepthBuffer(true);
        }
        this._renderingManager.render(null, null, true, true);
        for (var lensFlareSystemIndex = 0; lensFlareSystemIndex < this.lensFlareSystems.length; lensFlareSystemIndex++) {
            this.lensFlareSystems[lensFlareSystemIndex].render();
        }
        if (this.layers.length) {
            engine.setDepthBuffer(false);
            for (layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
                layer = this.layers[layerIndex];
                if (!layer.isBackground) {
                    layer.render();
                }
            }
            engine.setDepthBuffer(true);
        }
        this._renderDuration += new Date() - beforeRenderDate;
        this.postProcessManager._finalizeFrame();
        this.activeCamera._updateFromScene();
        this._renderTargets.reset();
    };
    BABYLON.Scene.prototype.render = function () {
        var startDate = new Date();
        this._particlesDuration = 0;
        this._spritesDuration = 0;
        this._activeParticles = 0;
        this._renderDuration = 0;
        this._evaluateActiveMeshesDuration = 0;
        this._totalVertices = 0;
        this._activeVertices = 0;
        if (this.beforeRender) {
            this.beforeRender();
        }
        for (var callbackIndex = 0; callbackIndex < this._onBeforeRenderCallbacks.length; callbackIndex++) {
            this._onBeforeRenderCallbacks[callbackIndex]();
        }
        var deltaTime = BABYLON.Tools.GetDeltaTime();
        this._animationRatio = deltaTime * (60.0 / 1000.0);
        this._animate();
        if (this._physicsEngine) {
            this._physicsEngine._runOneStep(deltaTime / 1000.0);
        }
        this._engine.clear(this.clearColor, this.autoClear || this.forceWireframe, true);
        for (var lightIndex = 0; lightIndex < this.lights.length; lightIndex++) {
            var light = this.lights[lightIndex];
            var shadowGenerator = light.getShadowGenerator();
            if (light.isEnabled() && shadowGenerator) {
                this._renderTargets.push(shadowGenerator.getShadowMap());
            }
        }
        if (this.activeCameras.length > 0) {
            var currentRenderId = this._renderId;
            for (var cameraIndex = 0; cameraIndex < this.activeCameras.length; cameraIndex++) {
                this._renderId = currentRenderId;
                this._renderForCamera(this.activeCameras[cameraIndex], cameraIndex != 0);
            }
        } else {
            this._renderForCamera(this.activeCamera);
        } if (this.afterRender) {
            this.afterRender();
        }
        for (var index = 0; index < this._toBeDisposed.length; index++) {
            this._toBeDisposed.data[index].dispose();
            this._toBeDisposed[index] = null;
        }
        this._toBeDisposed.reset();
        this._lastFrameDuration = new Date() - startDate;
    };
    BABYLON.Scene.prototype.dispose = function () {
        this.beforeRender = null;
        this.afterRender = null;
        this.skeletons = [];
        var canvas = this._engine.getRenderingCanvas();
        var index;
        for (index = 0; index < this.cameras.length; index++) {
            this.cameras[index].detachControl(canvas);
        }
        while (this.lights.length) {
            this.lights[0].dispose(true);
        }
        while (this.meshes.length) {
            this.meshes[0].dispose(true);
        }
        while (this.cameras.length) {
            this.cameras[0].dispose();
        }
        while (this.materials.length) {
            this.materials[0].dispose();
        }
        while (this.particleSystems.length) {
            this.particleSystems[0].dispose();
        }
        while (this.spriteManagers.length) {
            this.spriteManagers[0].dispose();
        }
        while (this.layers.length) {
            this.layers[0].dispose();
        }
        while (this.textures.length) {
            this.textures[0].dispose();
        }
        this.postProcessManager.dispose();
        if (this._physicsEngine) {
            this.disablePhysicsEngine();
        }
        index = this._engine.scenes.indexOf(this);
        this._engine.scenes.splice(index, 1);
        this._engine.wipeCaches();
    };
    BABYLON.Scene.prototype._getNewPosition = function (position, velocity, collider, maximumRetry, finalPosition) {
        position.divideToRef(collider.radius, this._scaledPosition);
        velocity.divideToRef(collider.radius, this._scaledVelocity);
        collider.retry = 0;
        collider.initialVelocity = this._scaledVelocity;
        collider.initialPosition = this._scaledPosition;
        this._collideWithWorld(this._scaledPosition, this._scaledVelocity, collider, maximumRetry, finalPosition);
        finalPosition.multiplyInPlace(collider.radius);
    };
    BABYLON.Scene.prototype._collideWithWorld = function (position, velocity, collider, maximumRetry, finalPosition) {
        var closeDistance = BABYLON.Engine.collisionsEpsilon * 10.0;
        if (collider.retry >= maximumRetry) {
            finalPosition.copyFrom(position);
            return;
        }
        collider._initialize(position, velocity, closeDistance);
        for (var index = 0; index < this.meshes.length; index++) {
            var mesh = this.meshes[index];
            if (mesh.isEnabled() && mesh.checkCollisions) {
                mesh._checkCollision(collider);
            }
        }
        if (!collider.collisionFound) {
            position.addToRef(velocity, finalPosition);
            return;
        }
        if (velocity.x != 0 || velocity.y != 0 || velocity.z != 0) {
            collider._getResponse(position, velocity);
        }
        if (velocity.length() <= closeDistance) {
            finalPosition.copyFrom(position);
            return;
        }
        collider.retry++;
        this._collideWithWorld(position, velocity, collider, maximumRetry, finalPosition);
    };
    BABYLON.Scene.prototype.createOrUpdateSelectionOctree = function () {
        if (!this._selectionOctree) {
            this._selectionOctree = new BABYLON.Octree();
        }
        var checkExtends = function (v, min, max) {
            if (v.x < min.x) min.x = v.x;
            if (v.y < min.y) min.y = v.y;
            if (v.z < min.z) min.z = v.z;
            if (v.x > max.x) max.x = v.x;
            if (v.y > max.y) max.y = v.y;
            if (v.z > max.z) max.z = v.z;
        };
        var min = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        var max = new BABYLON.Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        for (var index = 0; index < this.meshes.length; index++) {
            var mesh = this.meshes[index];
            mesh.computeWorldMatrix(true);
            var minBox = mesh.getBoundingInfo().boundingBox.minimumWorld;
            var maxBox = mesh.getBoundingInfo().boundingBox.maximumWorld;
            checkExtends(minBox, min, max);
            checkExtends(maxBox, min, max);
        }
        this._selectionOctree.update(min, max, this.meshes);
    };
    BABYLON.Scene.prototype.createPickingRay = function (x, y, world, camera) {
        var engine = this._engine;
        if (!camera) {
            if (!this.activeCamera) throw new Error("Active camera not set");
            camera = this.activeCamera;
        }
        var viewport = camera.viewport.toGlobal(engine);
        return BABYLON.Ray.CreateNew(x * this._engine.getHardwareScalingLevel(), y * this._engine.getHardwareScalingLevel(), viewport.width, viewport.height, world ? world : BABYLON.Matrix.Identity(), camera.getViewMatrix(), camera.getProjectionMatrix());
    };
    BABYLON.Scene.prototype._internalPick = function (rayFunction, predicate, fastCheck) {
        var pickingInfo = null;
        for (var meshIndex = 0; meshIndex < this.meshes.length; meshIndex++) {
            var mesh = this.meshes[meshIndex];
            if (predicate) {
                if (!predicate(mesh)) {
                    continue;
                }
            } else if (!mesh.isEnabled() || !mesh.isVisible || !mesh.isPickable) {
                continue;
            }
            var world = mesh.getWorldMatrix();
            var ray = rayFunction(world);
            var result = mesh.intersects(ray, fastCheck);
            if (!result.hit) continue;
            if (!fastCheck && pickingInfo != null && result.distance >= pickingInfo.distance) continue;
            pickingInfo = result;
            if (fastCheck) {
                break;
            }
        }
        return pickingInfo || new BABYLON.PickingInfo();
    };
    BABYLON.Scene.prototype.pick = function (x, y, predicate, fastCheck, camera) {
        var that = this;
        return this._internalPick(function (world) {
            return that.createPickingRay(x, y, world, camera);
        }, predicate, fastCheck);
    };
    BABYLON.Scene.prototype.pickWithRay = function (ray, predicate, fastCheck) {
        var that = this;
        return this._internalPick(function (world) {
            if (!that._pickWithRayInverseMatrix) {
                that._pickWithRayInverseMatrix = BABYLON.Matrix.Identity();
            }
            world.invertToRef(that._pickWithRayInverseMatrix);
            return BABYLON.Ray.Transform(ray, that._pickWithRayInverseMatrix);
        }, predicate, fastCheck);
    };
    BABYLON.Scene.prototype.enablePhysics = function (gravity, iterations) {
        if (this._physicsEngine) {
            return true;
        }
        if (!BABYLON.PhysicsEngine.IsSupported()) {
            return false;
        }
        this._physicsEngine = new BABYLON.PhysicsEngine(gravity, iterations || 10);
        return true;
    };
    BABYLON.Scene.prototype.disablePhysicsEngine = function () {
        if (!this._physicsEngine) {
            return;
        }
        this._physicsEngine.dispose();
        this._physicsEngine = undefined;
    };
    BABYLON.Scene.prototype.isPhysicsEnabled = function () {
        return this._physicsEngine !== undefined;
    };
    BABYLON.Scene.prototype.setGravity = function (gravity) {
        if (!this._physicsEngine) {
            return;
        }
        this._physicsEngine._setGravity(gravity);
    };
    BABYLON.Scene.prototype.createCompoundImpostor = function (options) {
        if (!this._physicsEngine) {
            return null;
        }
        for (var index = 0; index < options.parts.length; index++) {
            var mesh = options.parts[index].mesh;
            mesh._physicImpostor = options.parts[index].impostor;
            mesh._physicsMass = options.mass / options.parts.length;
            mesh._physicsFriction = options.friction;
            mesh._physicRestitution = options.restitution;
        }
        return this._physicsEngine._registerCompound(options);
    };
    BABYLON.Scene.prototype.deleteCompoundImpostor = function (compound) {
        for (var index = 0; index < compound.parts.length; index++) {
            var mesh = compound.parts[index].mesh;
            mesh._physicImpostor = BABYLON.PhysicsEngine.NoImpostor;
            this._scene._physicsEngine._unregisterMesh(mesh);
        }
    };
    BABYLON.Scene.FOGMODE_NONE = 0;
    BABYLON.Scene.FOGMODE_EXP = 1;
    BABYLON.Scene.FOGMODE_EXP2 = 2;
    BABYLON.Scene.FOGMODE_LINEAR = 3;
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.VertexBuffer = function (mesh, data, kind, updatable) {
        this._mesh = mesh;
        this._engine = mesh.getScene().getEngine();
        this._updatable = updatable;
        if (updatable) {
            this._buffer = this._engine.createDynamicVertexBuffer(data.length * 4);
            this._engine.updateDynamicVertexBuffer(this._buffer, data);
        } else {
            this._buffer = this._engine.createVertexBuffer(data);
        }
        this._data = data;
        this._kind = kind;
        switch (kind) {
        case BABYLON.VertexBuffer.PositionKind:
            this._strideSize = 3;
            this._mesh._resetPointsArrayCache();
            break;
        case BABYLON.VertexBuffer.NormalKind:
            this._strideSize = 3;
            break;
        case BABYLON.VertexBuffer.UVKind:
            this._strideSize = 2;
            break;
        case BABYLON.VertexBuffer.UV2Kind:
            this._strideSize = 2;
            break;
        case BABYLON.VertexBuffer.ColorKind:
            this._strideSize = 3;
            break;
        case BABYLON.VertexBuffer.MatricesIndicesKind:
            this._strideSize = 4;
            break;
        case BABYLON.VertexBuffer.MatricesWeightsKind:
            this._strideSize = 4;
            break;
        }
    };
    BABYLON.VertexBuffer.prototype.isUpdatable = function () {
        return this._updatable;
    };
    BABYLON.VertexBuffer.prototype.getData = function () {
        return this._data;
    };
    BABYLON.VertexBuffer.prototype.getStrideSize = function () {
        return this._strideSize;
    };
    BABYLON.VertexBuffer.prototype.update = function (data) {
        this._engine.updateDynamicVertexBuffer(this._buffer, data);
        this._data = data;
        if (this._kind === BABYLON.VertexBuffer.PositionKind) {
            this._mesh._resetPointsArrayCache();
        }
    };
    BABYLON.VertexBuffer.prototype.dispose = function () {
        this._engine._releaseBuffer(this._buffer);
    };
    BABYLON.VertexBuffer.PositionKind = "position";
    BABYLON.VertexBuffer.NormalKind = "normal";
    BABYLON.VertexBuffer.UVKind = "uv";
    BABYLON.VertexBuffer.UV2Kind = "uv2";
    BABYLON.VertexBuffer.ColorKind = "color";
    BABYLON.VertexBuffer.MatricesIndicesKind = "matricesIndices";
    BABYLON.VertexBuffer.MatricesWeightsKind = "matricesWeights";
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Mesh = function (name, scene) {
        BABYLON.Node.call(this, scene);
        this.name = name;
        this.id = name;
        this._totalVertices = 0;
        this._worldMatrix = BABYLON.Matrix.Identity();
        scene.meshes.push(this);
        this.position = new BABYLON.Vector3(0, 0, 0);
        this.rotation = new BABYLON.Vector3(0, 0, 0);
        this.rotationQuaternion = null;
        this.scaling = new BABYLON.Vector3(1, 1, 1);
        this._pivotMatrix = BABYLON.Matrix.Identity();
        this._indices = [];
        this.subMeshes = [];
        this._renderId = 0;
        this._onBeforeRenderCallbacks = [];
        this.animations = [];
        this._positions = null;
        BABYLON.Mesh.prototype._initCache.call(this);
        this._localScaling = BABYLON.Matrix.Zero();
        this._localRotation = BABYLON.Matrix.Zero();
        this._localTranslation = BABYLON.Matrix.Zero();
        this._localBillboard = BABYLON.Matrix.Zero();
        this._localPivotScaling = BABYLON.Matrix.Zero();
        this._localPivotScalingRotation = BABYLON.Matrix.Zero();
        this._localWorld = BABYLON.Matrix.Zero();
        this._worldMatrix = BABYLON.Matrix.Zero();
        this._rotateYByPI = BABYLON.Matrix.RotationY(Math.PI);
        this._collisionsTransformMatrix = BABYLON.Matrix.Zero();
        this._collisionsScalingMatrix = BABYLON.Matrix.Zero();
        this._absolutePosition = BABYLON.Vector3.Zero();
    };
    BABYLON.Mesh.prototype = Object.create(BABYLON.Node.prototype);
    BABYLON.Mesh.BILLBOARDMODE_NONE = 0;
    BABYLON.Mesh.BILLBOARDMODE_X = 1;
    BABYLON.Mesh.BILLBOARDMODE_Y = 2;
    BABYLON.Mesh.BILLBOARDMODE_Z = 4;
    BABYLON.Mesh.BILLBOARDMODE_ALL = 7;
    BABYLON.Mesh.prototype.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_NONE;
    BABYLON.Mesh.prototype.material = null;
    BABYLON.Mesh.prototype.isVisible = true;
    BABYLON.Mesh.prototype.isPickable = true;
    BABYLON.Mesh.prototype.visibility = 1.0;
    BABYLON.Mesh.prototype.billboardMode = BABYLON.Mesh.BILLBOARDMODE_NONE;
    BABYLON.Mesh.prototype.checkCollisions = false;
    BABYLON.Mesh.prototype.receiveShadows = false;
    BABYLON.Mesh.prototype._isDisposed = false;
    BABYLON.Mesh.prototype.onDispose = null;
    BABYLON.Mesh.prototype.skeleton = null;
    BABYLON.Mesh.prototype.renderingGroupId = 0;
    BABYLON.Mesh.prototype.infiniteDistance = false;
    BABYLON.Mesh.prototype.getBoundingInfo = function () {
        return this._boundingInfo;
    };
    BABYLON.Mesh.prototype.getScene = function () {
        return this._scene;
    };
    BABYLON.Mesh.prototype.getWorldMatrix = function () {
        if (this._currentRenderId !== this._scene.getRenderId()) {
            this.computeWorldMatrix();
        }
        return this._worldMatrix;
    };
    BABYLON.Mesh.prototype.rotate = function (axis, amount, space) {
        if (!this.rotationQuaternion) {
            this.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
            this.rotation = BABYLON.Vector3.Zero();
        }
        if (!space || space == BABYLON.Space.LOCAL) {
            var rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, amount);
            this.rotationQuaternion = this.rotationQuaternion.multiply(rotationQuaternion);
        } else {
            if (this.parent) {
                var invertParentWorldMatrix = this.parent.getWorldMatrix().clone();
                invertParentWorldMatrix.invert();
                axis = BABYLON.Vector3.TransformNormal(axis, invertParentWorldMatrix);
            }
            var rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, amount);
            this.rotationQuaternion = rotationQuaternion.multiply(this.rotationQuaternion);
        }
    };
    BABYLON.Mesh.prototype.translate = function (axis, distance, space) {
        var displacementVector = axis.scale(distance);
        if (!space || space == BABYLON.Space.LOCAL) {
            var tempV3 = this.getPositionExpressedInLocalSpace().add(displacementVector);
            this.setPositionWithLocalVector(tempV3);
        } else {
            this.setAbsolutePosition(this.getAbsolutePosition().add(displacementVector));
        }
    };
    BABYLON.Mesh.prototype.getAbsolutePosition = function () {
        this.computeWorldMatrix();
        return this._absolutePosition;
    };
    BABYLON.Mesh.prototype.setAbsolutePosition = function (absolutePosition) {
        if (!absolutePosition) {
            return;
        }
        var absolutePositionX;
        var absolutePositionY;
        var absolutePositionZ;
        if (absolutePosition.x === undefined) {
            if (arguments.length < 3) {
                return;
            }
            absolutePositionX = arguments[0];
            absolutePositionY = arguments[1];
            absolutePositionZ = arguments[2];
        } else {
            absolutePositionX = absolutePosition.x;
            absolutePositionY = absolutePosition.y;
            absolutePositionZ = absolutePosition.z;
        } if (this.parent) {
            var invertParentWorldMatrix = this.parent.getWorldMatrix().clone();
            invertParentWorldMatrix.invert();
            var worldPosition = new BABYLON.Vector3(absolutePositionX, absolutePositionY, absolutePositionZ);
            this.position = BABYLON.Vector3.TransformCoordinates(worldPosition, invertParentWorldMatrix);
        } else {
            this.position.x = absolutePositionX;
            this.position.y = absolutePositionY;
            this.position.z = absolutePositionZ;
        }
    };
    BABYLON.Mesh.prototype.getTotalVertices = function () {
        return this._totalVertices;
    };
    BABYLON.Mesh.prototype.getVerticesData = function (kind) {
        return this._vertexBuffers[kind].getData();
    };
    BABYLON.Mesh.prototype.getVertexBuffer = function (kind) {
        return this._vertexBuffers[kind];
    };
    BABYLON.Mesh.prototype.isVerticesDataPresent = function (kind) {
        if (!this._vertexBuffers) {
            if (this._delayInfo) {
                return this._delayInfo.indexOf(kind) !== -1;
            }
            return false;
        }
        return this._vertexBuffers[kind] !== undefined;
    };
    BABYLON.Mesh.prototype.getVerticesDataKinds = function () {
        var result = [];
        if (!this._vertexBuffers && this._delayInfo) {
            for (var kind in this._delayInfo) {
                result.push(kind);
            }
        } else {
            for (var kind in this._vertexBuffers) {
                result.push(kind);
            }
        }
        return result;
    };
    BABYLON.Mesh.prototype.getTotalIndices = function () {
        return this._indices.length;
    };
    BABYLON.Mesh.prototype.getIndices = function () {
        return this._indices;
    };
    BABYLON.Mesh.prototype.getVertexStrideSize = function () {
        return this._vertexStrideSize;
    };
    BABYLON.Mesh.prototype.setPivotMatrix = function (matrix) {
        this._pivotMatrix = matrix;
        this._cache.pivotMatrixUpdated = true;
    };
    BABYLON.Mesh.prototype.getPivotMatrix = function () {
        return this._pivotMatrix;
    };
    BABYLON.Mesh.prototype._isSynchronized = function () {
        if (this.billboardMode !== BABYLON.Mesh.BILLBOARDMODE_NONE) return false;
        if (this._cache.pivotMatrixUpdated) {
            return false;
        }
        if (this.infiniteDistance) {
            return false;
        }
        if (!this._cache.position.equals(this.position)) return false;
        if (this.rotationQuaternion) {
            if (!this._cache.rotationQuaternion.equals(this.rotationQuaternion)) return false;
        } else {
            if (!this._cache.rotation.equals(this.rotation)) return false;
        } if (!this._cache.scaling.equals(this.scaling)) return false;
        return true;
    };
    BABYLON.Mesh.prototype.isReady = function () {
        return this._isReady;
    };
    BABYLON.Mesh.prototype.isAnimated = function () {
        return this._animationStarted;
    };
    BABYLON.Mesh.prototype.isDisposed = function () {
        return this._isDisposed;
    };
    BABYLON.Mesh.prototype._initCache = function () {
        this._cache.localMatrixUpdated = false;
        this._cache.position = BABYLON.Vector3.Zero();
        this._cache.scaling = BABYLON.Vector3.Zero();
        this._cache.rotation = BABYLON.Vector3.Zero();
        this._cache.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 0);
    };
    BABYLON.Mesh.prototype.markAsDirty = function (property) {
        if (property === "rotation") {
            this.rotationQuaternion = null;
        }
        this._currentRenderId = -1;
    };
    BABYLON.Mesh.prototype.refreshBoundingInfo = function () {
        var data = this.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        if (!data) {
            return;
        }
        var extend = BABYLON.Tools.ExtractMinAndMax(data, 0, this._totalVertices);
        this._boundingInfo = new BABYLON.BoundingInfo(extend.minimum, extend.maximum);
        for (var index = 0; index < this.subMeshes.length; index++) {
            this.subMeshes[index].refreshBoundingInfo();
        }
        this._updateBoundingInfo();
    };
    BABYLON.Mesh.prototype._updateBoundingInfo = function () {
        this._boundingInfo = this._boundingInfo || new BABYLON.BoundingInfo(this._absolutePosition, this._absolutePosition);
        this._scaleFactor = Math.max(this.scaling.x, this.scaling.y);
        this._scaleFactor = Math.max(this._scaleFactor, this.scaling.z);
        if (this.parent && this.parent._scaleFactor) this._scaleFactor = this._scaleFactor * this.parent._scaleFactor;
        this._boundingInfo._update(this._worldMatrix, this._scaleFactor);
        for (var subIndex = 0; subIndex < this.subMeshes.length; subIndex++) {
            var subMesh = this.subMeshes[subIndex];
            subMesh.updateBoundingInfo(this._worldMatrix, this._scaleFactor);
        }
    };
    BABYLON.Mesh.prototype.computeWorldMatrix = function (force) {
        if (!force && (this._currentRenderId == this._scene.getRenderId() || this.isSynchronized(true))) {
            this._currentRenderId = this._scene.getRenderId();
            return this._worldMatrix;
        }
        this._cache.position.copyFrom(this.position);
        this._cache.scaling.copyFrom(this.scaling);
        this._cache.pivotMatrixUpdated = false;
        this._currentRenderId = this._scene.getRenderId();
        BABYLON.Matrix.ScalingToRef(this.scaling.x, this.scaling.y, this.scaling.z, this._localScaling);
        if (this.rotationQuaternion) {
            this.rotationQuaternion.toRotationMatrix(this._localRotation);
            this._cache.rotationQuaternion.copyFrom(this.rotationQuaternion);
        } else {
            BABYLON.Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this._localRotation);
            this._cache.rotation.copyFrom(this.rotation);
        } if (this.infiniteDistance && !this.parent) {
            var camera = this._scene.activeCamera;
            var cameraWorldMatrix = camera.getWorldMatrix();
            var cameraGlobalPosition = new BABYLON.Vector3(cameraWorldMatrix.m[12], cameraWorldMatrix.m[13], cameraWorldMatrix.m[14]);
            BABYLON.Matrix.TranslationToRef(this.position.x + cameraGlobalPosition.x, this.position.y + cameraGlobalPosition.y, this.position.z + cameraGlobalPosition.z, this._localTranslation);
        } else {
            BABYLON.Matrix.TranslationToRef(this.position.x, this.position.y, this.position.z, this._localTranslation);
        }
        this._pivotMatrix.multiplyToRef(this._localScaling, this._localPivotScaling);
        this._localPivotScaling.multiplyToRef(this._localRotation, this._localPivotScalingRotation);
        if (this.billboardMode !== BABYLON.Mesh.BILLBOARDMODE_NONE) {
            var localPosition = this.position.clone();
            var zero = this._scene.activeCamera.position.clone();
            if (this.parent && this.parent.position) {
                localPosition.addInPlace(this.parent.position);
                BABYLON.Matrix.TranslationToRef(localPosition.x, localPosition.y, localPosition.z, this._localTranslation);
            }
            if (this.billboardMode & BABYLON.Mesh.BILLBOARDMODE_ALL === BABYLON.Mesh.BILLBOARDMODE_ALL) {
                zero = this._scene.activeCamera.position;
            } else {
                if (this.billboardMode & BABYLON.Mesh.BILLBOARDMODE_X) zero.x = localPosition.x + BABYLON.Engine.epsilon;
                if (this.billboardMode & BABYLON.Mesh.BILLBOARDMODE_Y) zero.y = localPosition.y + BABYLON.Engine.epsilon;
                if (this.billboardMode & BABYLON.Mesh.BILLBOARDMODE_Z) zero.z = localPosition.z + BABYLON.Engine.epsilon;
            }
            BABYLON.Matrix.LookAtLHToRef(localPosition, zero, BABYLON.Vector3.Up(), this._localBillboard);
            this._localBillboard.m[12] = this._localBillboard.m[13] = this._localBillboard.m[14] = 0;
            this._localBillboard.invert();
            this._localPivotScalingRotation.multiplyToRef(this._localBillboard, this._localWorld);
            this._rotateYByPI.multiplyToRef(this._localWorld, this._localPivotScalingRotation);
        }
        this._localPivotScalingRotation.multiplyToRef(this._localTranslation, this._localWorld);
        if (this.parent && this.parent.getWorldMatrix && this.billboardMode === BABYLON.Mesh.BILLBOARDMODE_NONE) {
            this._localWorld.multiplyToRef(this.parent.getWorldMatrix(), this._worldMatrix);
        } else {
            this._worldMatrix.copyFrom(this._localWorld);
        }
        this._updateBoundingInfo();
        this._absolutePosition.copyFromFloats(this._worldMatrix.m[12], this._worldMatrix.m[13], this._worldMatrix.m[14]);
        return this._worldMatrix;
    };
    BABYLON.Mesh.prototype._createGlobalSubMesh = function () {
        if (!this._totalVertices || !this._indices) {
            return null;
        }
        this.subMeshes = [];
        return new BABYLON.SubMesh(0, 0, this._totalVertices, 0, this._indices.length, this);
    };
    BABYLON.Mesh.prototype.subdivide = function (count) {
        if (count < 1) {
            return;
        }
        var subdivisionSize = this._indices.length / count;
        var offset = 0;
        this.subMeshes = [];
        for (var index = 0; index < count; index++) {
            BABYLON.SubMesh.CreateFromIndices(0, offset, Math.min(subdivisionSize, this._indices.length - offset), this);
            offset += subdivisionSize;
        }
    };
    BABYLON.Mesh.prototype.setVerticesData = function (data, kind, updatable) {
        if (!this._vertexBuffers) {
            this._vertexBuffers = {};
        }
        if (this._vertexBuffers[kind]) {
            this._vertexBuffers[kind].dispose();
        }
        this._vertexBuffers[kind] = new BABYLON.VertexBuffer(this, data, kind, updatable);
        if (kind === BABYLON.VertexBuffer.PositionKind) {
            var stride = this._vertexBuffers[kind].getStrideSize();
            this._totalVertices = data.length / stride;
            var extend = BABYLON.Tools.ExtractMinAndMax(data, 0, this._totalVertices);
            this._boundingInfo = new BABYLON.BoundingInfo(extend.minimum, extend.maximum);
            this._createGlobalSubMesh();
        }
    };
    BABYLON.Mesh.prototype.updateVerticesData = function (kind, data) {
        if (this._vertexBuffers[kind]) {
            this._vertexBuffers[kind].update(data);
        }
    };
    BABYLON.Mesh.prototype.setIndices = function (indices) {
        if (this._indexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._indexBuffer);
        }
        this._indexBuffer = this._scene.getEngine().createIndexBuffer(indices);
        this._indices = indices;
        this._createGlobalSubMesh();
    };
    BABYLON.Mesh.prototype.bindAndDraw = function (subMesh, effect, wireframe) {
        var engine = this._scene.getEngine();
        var indexToBind = this._indexBuffer;
        var useTriangles = true;
        if (wireframe) {
            indexToBind = subMesh.getLinesIndexBuffer(this._indices, engine);
            useTriangles = false;
        }
        engine.bindMultiBuffers(this._vertexBuffers, indexToBind, effect);
        engine.draw(useTriangles, useTriangles ? subMesh.indexStart : 0, useTriangles ? subMesh.indexCount : subMesh.linesIndexCount);
    };
    BABYLON.Mesh.prototype.registerBeforeRender = function (func) {
        this._onBeforeRenderCallbacks.push(func);
    };
    BABYLON.Mesh.prototype.unregisterBeforeRender = function (func) {
        var index = this._onBeforeRenderCallbacks.indexOf(func);
        if (index > -1) {
            this._onBeforeRenderCallbacks.splice(index, 1);
        }
    };
    BABYLON.Mesh.prototype.render = function (subMesh) {
        if (!this._vertexBuffers || !this._indexBuffer) {
            return;
        }
        for (var callbackIndex = 0; callbackIndex < this._onBeforeRenderCallbacks.length; callbackIndex++) {
            this._onBeforeRenderCallbacks[callbackIndex]();
        }
        var world = this.getWorldMatrix();
        var effectiveMaterial = subMesh.getMaterial();
        if (!effectiveMaterial || !effectiveMaterial.isReady(this)) {
            return;
        }
        effectiveMaterial._preBind();
        effectiveMaterial.bind(world, this);
        var engine = this._scene.getEngine();
        this.bindAndDraw(subMesh, effectiveMaterial.getEffect(), engine.forceWireframe || effectiveMaterial.wireframe);
        effectiveMaterial.unbind();
    };
    BABYLON.Mesh.prototype.getEmittedParticleSystems = function () {
        var results = [];
        for (var index = 0; index < this._scene.particleSystems.length; index++) {
            var particleSystem = this._scene.particleSystems[index];
            if (particleSystem.emitter === this) {
                results.push(particleSystem);
            }
        }
        return results;
    };
    BABYLON.Mesh.prototype.getHierarchyEmittedParticleSystems = function () {
        var results = [];
        var descendants = this.getDescendants();
        descendants.push(this);
        for (var index = 0; index < this._scene.particleSystems.length; index++) {
            var particleSystem = this._scene.particleSystems[index];
            if (descendants.indexOf(particleSystem.emitter) !== -1) {
                results.push(particleSystem);
            }
        }
        return results;
    };
    BABYLON.Mesh.prototype.getChildren = function () {
        var results = [];
        for (var index = 0; index < this._scene.meshes.length; index++) {
            var mesh = this._scene.meshes[index];
            if (mesh.parent == this) {
                results.push(mesh);
            }
        }
        return results;
    };
    BABYLON.Mesh.prototype.isInFrustum = function (frustumPlanes) {
        if (this.delayLoadState === BABYLON.Engine.DELAYLOADSTATE_LOADING) {
            return false;
        }
        var result = this._boundingInfo.isInFrustum(frustumPlanes);
        if (result && this.delayLoadState === BABYLON.Engine.DELAYLOADSTATE_NOTLOADED) {
            this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_LOADING;
            var that = this;
            this._scene._addPendingData(this);
            BABYLON.Tools.LoadFile(this.delayLoadingFile, function (data) {
                that._delayLoadingFunction(JSON.parse(data), that);
                that.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_LOADED;
                that._scene._removePendingData(that);
            }, function () {}, this._scene.database);
        }
        return result;
    };
    BABYLON.Mesh.prototype.setMaterialByID = function (id) {
        var materials = this._scene.materials;
        for (var index = 0; index < materials.length; index++) {
            if (materials[index].id == id) {
                this.material = materials[index];
                return;
            }
        }
        var multiMaterials = this._scene.multiMaterials;
        for (var index = 0; index < multiMaterials.length; index++) {
            if (multiMaterials[index].id == id) {
                this.material = multiMaterials[index];
                return;
            }
        }
    };
    BABYLON.Mesh.prototype.getAnimatables = function () {
        var results = [];
        if (this.material) {
            results.push(this.material);
        }
        return results;
    };
    BABYLON.Mesh.prototype.setPositionWithLocalVector = function (vector3) {
        this.computeWorldMatrix();
        this.position = BABYLON.Vector3.TransformNormal(vector3, this._localWorld);
    };
    BABYLON.Mesh.prototype.getPositionExpressedInLocalSpace = function () {
        this.computeWorldMatrix();
        var invLocalWorldMatrix = this._localWorld.clone();
        invLocalWorldMatrix.invert();
        return BABYLON.Vector3.TransformNormal(this.position, invLocalWorldMatrix);
    };
    BABYLON.Mesh.prototype.locallyTranslate = function (vector3) {
        this.computeWorldMatrix();
        this.position = BABYLON.Vector3.TransformCoordinates(vector3, this._localWorld);
    };
    BABYLON.Mesh.prototype.bakeTransformIntoVertices = function (transform) {
        if (!this.isVerticesDataPresent(BABYLON.VertexBuffer.PositionKind)) {
            return;
        }
        this._resetPointsArrayCache();
        var data = this._vertexBuffers[BABYLON.VertexBuffer.PositionKind].getData();
        var temp = new BABYLON.MatrixType(data.length);
        for (var index = 0; index < data.length; index += 3) {
            BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.FromArray(data, index), transform).toArray(temp, index);
        }
        this.setVerticesData(temp, BABYLON.VertexBuffer.PositionKind, this._vertexBuffers[BABYLON.VertexBuffer.PositionKind].isUpdatable());
        if (!this.isVerticesDataPresent(BABYLON.VertexBuffer.NormalKind)) {
            return;
        }
        data = this._vertexBuffers[BABYLON.VertexBuffer.NormalKind].getData();
        for (var index = 0; index < data.length; index += 3) {
            BABYLON.Vector3.TransformNormal(BABYLON.Vector3.FromArray(data, index), transform).toArray(temp, index);
        }
        this.setVerticesData(temp, BABYLON.VertexBuffer.NormalKind, this._vertexBuffers[BABYLON.VertexBuffer.NormalKind].isUpdatable());
    };
    BABYLON.Mesh.prototype.lookAt = function (targetPoint, yawCor, pitchCor, rollCor) {
        yawCor = yawCor || 0;
        pitchCor = pitchCor || 0;
        rollCor = rollCor || 0;
        var dv = targetPoint.subtract(this.position);
        var yaw = -Math.atan2(dv.z, dv.x) - Math.PI / 2;
        var len = Math.sqrt(dv.x * dv.x + dv.z * dv.z);
        var pitch = Math.atan2(dv.y, len);
        this.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(yaw + yawCor, pitch + pitchCor, rollCor);
    };
    BABYLON.Mesh.prototype._resetPointsArrayCache = function () {
        this._positions = null;
    };
    BABYLON.Mesh.prototype._generatePointsArray = function () {
        if (this._positions) return;
        this._positions = [];
        var data = this._vertexBuffers[BABYLON.VertexBuffer.PositionKind].getData();
        for (var index = 0; index < data.length; index += 3) {
            this._positions.push(BABYLON.Vector3.FromArray(data, index));
        }
    };
    BABYLON.Mesh.prototype._collideForSubMesh = function (subMesh, transformMatrix, collider) {
        this._generatePointsArray();
        if (!subMesh._lastColliderWorldVertices || !subMesh._lastColliderTransformMatrix.equals(transformMatrix)) {
            subMesh._lastColliderTransformMatrix = transformMatrix;
            subMesh._lastColliderWorldVertices = [];
            var start = subMesh.verticesStart;
            var end = (subMesh.verticesStart + subMesh.verticesCount);
            for (var i = start; i < end; i++) {
                subMesh._lastColliderWorldVertices.push(BABYLON.Vector3.TransformCoordinates(this._positions[i], transformMatrix));
            }
        }
        collider._collide(subMesh, subMesh._lastColliderWorldVertices, this._indices, subMesh.indexStart, subMesh.indexStart + subMesh.indexCount, subMesh.verticesStart);
    };
    BABYLON.Mesh.prototype._processCollisionsForSubModels = function (collider, transformMatrix) {
        for (var index = 0; index < this.subMeshes.length; index++) {
            var subMesh = this.subMeshes[index];
            if (this.subMeshes.length > 1 && !subMesh._checkCollision(collider)) continue;
            this._collideForSubMesh(subMesh, transformMatrix, collider);
        }
    };
    BABYLON.Mesh.prototype._checkCollision = function (collider) {
        if (!this._boundingInfo._checkCollision(collider)) return;
        BABYLON.Matrix.ScalingToRef(1.0 / collider.radius.x, 1.0 / collider.radius.y, 1.0 / collider.radius.z, this._collisionsScalingMatrix);
        this._worldMatrix.multiplyToRef(this._collisionsScalingMatrix, this._collisionsTransformMatrix);
        this._processCollisionsForSubModels(collider, this._collisionsTransformMatrix);
    };
    BABYLON.Mesh.prototype.intersectsMesh = function (mesh, precise) {
        if (!this._boundingInfo || !mesh._boundingInfo) {
            return false;
        }
        return this._boundingInfo.intersects(mesh._boundingInfo, precise);
    };
    BABYLON.Mesh.prototype.intersectsPoint = function (point) {
        if (!this._boundingInfo) {
            return false;
        }
        return this._boundingInfo.intersectsPoint(point);
    };
    BABYLON.Mesh.prototype.intersects = function (ray, fastCheck) {
        var pickingInfo = new BABYLON.PickingInfo();
        if (!this._boundingInfo || !ray.intersectsSphere(this._boundingInfo.boundingSphere) || !ray.intersectsBox(this._boundingInfo.boundingBox)) {
            return pickingInfo;
        }
        this._generatePointsArray();
        var intersectInfo = null;
        for (var index = 0; index < this.subMeshes.length; index++) {
            var subMesh = this.subMeshes[index];
            if (this.subMeshes.length > 1 && !subMesh.canIntersects(ray)) continue;
            var currentIntersectInfo = subMesh.intersects(ray, this._positions, this._indices, fastCheck);
            if (currentIntersectInfo) {
                if (fastCheck || !intersectInfo || currentIntersectInfo.distance < intersectInfo.distance) {
                    intersectInfo = currentIntersectInfo;
                    if (fastCheck) {
                        break;
                    }
                }
            }
        }
        if (intersectInfo) {
            var world = this.getWorldMatrix();
            var worldOrigin = BABYLON.Vector3.TransformCoordinates(ray.origin, world);
            var direction = ray.direction.clone();
            direction.normalize();
            direction = direction.scale(intersectInfo.distance);
            var worldDirection = BABYLON.Vector3.TransformNormal(direction, world);
            var pickedPoint = worldOrigin.add(worldDirection);
            pickingInfo.hit = true;
            pickingInfo.distance = BABYLON.Vector3.Distance(worldOrigin, pickedPoint);
            pickingInfo.pickedPoint = pickedPoint;
            pickingInfo.pickedMesh = this;
            pickingInfo.bu = intersectInfo.bu;
            pickingInfo.bv = intersectInfo.bv;
            pickingInfo.faceId = intersectInfo.faceId;
            return pickingInfo;
        }
        return pickingInfo;
    };
    BABYLON.Mesh.prototype.clone = function (name, newParent, doNotCloneChildren) {
        var result = new BABYLON.Mesh(name, this._scene);
        result._vertexBuffers = this._vertexBuffers;
        for (var kind in result._vertexBuffers) {
            result._vertexBuffers[kind]._buffer.references++;
        }
        result._indexBuffer = this._indexBuffer;
        this._indexBuffer.references++;
        BABYLON.Tools.DeepCopy(this, result, ["name", "material", "skeleton"], ["_indices", "_totalVertices"]);
        var extend = BABYLON.Tools.ExtractMinAndMax(this.getVerticesData(BABYLON.VertexBuffer.PositionKind), 0, this._totalVertices);
        result._boundingInfo = new BABYLON.BoundingInfo(extend.minimum, extend.maximum);
        result.material = this.material;
        if (newParent) {
            result.parent = newParent;
        }
        if (!doNotCloneChildren) {
            for (var index = 0; index < this._scene.meshes.length; index++) {
                var mesh = this._scene.meshes[index];
                if (mesh.parent == this) {
                    mesh.clone(mesh.name, result);
                }
            }
        }
        for (var index = 0; index < this._scene.particleSystems.length; index++) {
            var system = this._scene.particleSystems[index];
            if (system.emitter == this) {
                system.clone(system.name, result);
            }
        }
        result.computeWorldMatrix(true);
        return result;
    };
    BABYLON.Mesh.prototype.dispose = function (doNotRecurse) {
        if (this._vertexBuffers) {
            for (var vbKind in this._vertexBuffers) {
                this._vertexBuffers[vbKind].dispose();
            }
            this._vertexBuffers = null;
        }
        if (this._indexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }
        if (this.getPhysicsImpostor() != BABYLON.PhysicsEngine.NoImpostor) {
            this.setPhysicsState({
                impostor: BABYLON.PhysicsEngine.NoImpostor
            });
        }
        var index = this._scene.meshes.indexOf(this);
        this._scene.meshes.splice(index, 1);
        if (!doNotRecurse) {
            for (var index = 0; index < this._scene.particleSystems.length; index++) {
                if (this._scene.particleSystems[index].emitter == this) {
                    this._scene.particleSystems[index].dispose();
                    index--;
                }
            }
            var objects = this._scene.meshes.slice(0);
            for (var index = 0; index < objects.length; index++) {
                if (objects[index].parent == this) {
                    objects[index].dispose();
                }
            }
        } else {
            for (var index = 0; index < this._scene.meshes.length; index++) {
                var obj = this._scene.meshes[index];
                if (obj.parent === this) {
                    obj.parent = null;
                    obj.computeWorldMatrix(true);
                }
            }
        }
        this._isDisposed = true;
        if (this.onDispose) {
            this.onDispose();
        }
    };
    BABYLON.Mesh.prototype.setPhysicsState = function (options) {
        if (!this._scene._physicsEngine) {
            return;
        }
        options.impostor = options.impostor || BABYLON.PhysicsEngine.NoImpostor;
        options.mass = options.mass || 0;
        options.friction = options.friction || 0.2;
        options.restitution = options.restitution || 0.9;
        this._physicImpostor = options.impostor;
        this._physicsMass = options.mass;
        this._physicsFriction = options.friction;
        this._physicRestitution = options.restitution;
        if (options.impostor === BABYLON.PhysicsEngine.NoImpostor) {
            this._scene._physicsEngine._unregisterMesh(this);
            return;
        }
        this._scene._physicsEngine._registerMesh(this, options);
    };
    BABYLON.Mesh.prototype.getPhysicsImpostor = function () {
        if (!this._physicImpostor) {
            return BABYLON.PhysicsEngine.NoImpostor;
        }
        return this._physicImpostor;
    };
    BABYLON.Mesh.prototype.getPhysicsMass = function () {
        if (!this._physicsMass) {
            return 0;
        }
        return this._physicsMass;
    };
    BABYLON.Mesh.prototype.getPhysicsFriction = function () {
        if (!this._physicsFriction) {
            return 0;
        }
        return this._physicsFriction;
    };
    BABYLON.Mesh.prototype.getPhysicsRestitution = function () {
        if (!this._physicRestitution) {
            return 0;
        }
        return this._physicRestitution;
    };
    BABYLON.Mesh.prototype.applyImpulse = function (force, contactPoint) {
        if (!this._physicImpostor) {
            return;
        }
        this._scene._physicsEngine._applyImpulse(this, force, contactPoint);
    };
    BABYLON.Mesh.prototype.setPhysicsLinkWith = function (otherMesh, pivot1, pivot2) {
        if (!this._physicImpostor) {
            return;
        }
        this._scene._physicsEngine._createLink(this, otherMesh, pivot1, pivot2);
    };
    BABYLON.Mesh.prototype.convertToFlatShadedMesh = function () {
        var kinds = this.getVerticesDataKinds();
        var vbs = [];
        var data = [];
        var newdata = [];
        var updatableNormals = false;
        for (var kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
            var kind = kinds[kindIndex];
            if (kind === BABYLON.VertexBuffer.NormalKind) {
                updatableNormals = this.getVertexBuffer(kind).isUpdatable();
                kinds.splice(kindIndex, 1);
                kindIndex--;
                continue;
            }
            vbs[kind] = this.getVertexBuffer(kind);
            data[kind] = vbs[kind].getData();
            newdata[kind] = [];
        }
        var previousSubmeshes = this.subMeshes.slice(0);
        var indices = this.getIndices();
        for (var index = 0; index < indices.length; index++) {
            var vertexIndex = indices[index];
            for (var kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
                var kind = kinds[kindIndex];
                var stride = vbs[kind].getStrideSize();
                for (var offset = 0; offset < stride; offset++) {
                    newdata[kind].push(data[kind][vertexIndex * stride + offset]);
                }
            }
        }
        var normals = [];
        var positions = newdata[BABYLON.VertexBuffer.PositionKind];
        for (var index = 0; index < indices.length; index += 3) {
            indices[index] = index;
            indices[index + 1] = index + 1;
            indices[index + 2] = index + 2;
            var p1 = BABYLON.Vector3.FromArray(positions, index * 3);
            var p2 = BABYLON.Vector3.FromArray(positions, (index + 1) * 3);
            var p3 = BABYLON.Vector3.FromArray(positions, (index + 2) * 3);
            var p1p2 = p1.subtract(p2);
            var p3p2 = p3.subtract(p2);
            var normal = BABYLON.Vector3.Normalize(BABYLON.Vector3.Cross(p1p2, p3p2));
            for (var localIndex = 0; localIndex < 3; localIndex++) {
                normals.push(normal.x);
                normals.push(normal.y);
                normals.push(normal.z);
            }
        }
        this.setIndices(indices);
        this.setVerticesData(normals, BABYLON.VertexBuffer.NormalKind, updatableNormals);
        for (var kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
            var kind = kinds[kindIndex];
            this.setVerticesData(newdata[kind], kind, vbs[kind].isUpdatable());
        }
        this.subMeshes = [];
        for (var submeshIndex = 0; submeshIndex < previousSubmeshes.length; submeshIndex++) {
            var previousOne = previousSubmeshes[submeshIndex];
            var subMesh = new BABYLON.SubMesh(previousOne.materialIndex, previousOne.indexStart, previousOne.indexCount, previousOne.indexStart, previousOne.indexCount, this);
        }
    };
    BABYLON.Mesh.CreateBox = function (name, size, scene, updatable) {
        var box = new BABYLON.Mesh(name, scene);
        var vertexData = BABYLON.VertexData.CreateBox(size);
        vertexData.applyToMesh(box, updatable);
        return box;
    };
    BABYLON.Mesh.CreateSphere = function (name, segments, diameter, scene, updatable) {
        var sphere = new BABYLON.Mesh(name, scene);
        var vertexData = BABYLON.VertexData.CreateSphere(segments, diameter);
        vertexData.applyToMesh(sphere, updatable);
        return sphere;
    };
    BABYLON.Mesh.CreateCylinder = function (name, height, diameterTop, diameterBottom, tessellation, scene, updatable) {
        var cylinder = new BABYLON.Mesh(name, scene);
        var vertexData = BABYLON.VertexData.CreateCylinder(height, diameterTop, diameterBottom, tessellation);
        vertexData.applyToMesh(cylinder, updatable);
        return cylinder;
    };
    BABYLON.Mesh.CreateTorus = function (name, diameter, thickness, tessellation, scene, updatable) {
        var torus = new BABYLON.Mesh(name, scene);
        var vertexData = BABYLON.VertexData.CreateTorus(diameter, thickness, tessellation);
        vertexData.applyToMesh(torus, updatable);
        return torus;
    };
    BABYLON.Mesh.CreatePlane = function (name, size, scene, updatable) {
        var plane = new BABYLON.Mesh(name, scene);
        var vertexData = BABYLON.VertexData.CreatePlane(size);
        vertexData.applyToMesh(plane, updatable);
        return plane;
    };
    BABYLON.Mesh.CreateGround = function (name, width, height, subdivisions, scene, updatable) {
        var ground = new BABYLON.Mesh(name, scene);
        var vertexData = BABYLON.VertexData.CreateGround(width, height, subdivisions);
        vertexData.applyToMesh(ground, updatable);
        return ground;
    };
    BABYLON.Mesh.CreateGroundFromHeightMap = function (name, url, width, height, subdivisions, minHeight, maxHeight, scene, updatable) {
        var ground = new BABYLON.Mesh(name, scene);
        var onload = function (img) {
            var indices = [];
            var positions = [];
            var normals = [];
            var uvs = [];
            var row, col;
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var heightMapWidth = img.width;
            var heightMapHeight = img.height;
            canvas.width = heightMapWidth;
            canvas.height = heightMapHeight;
            context.drawImage(img, 0, 0);
            var buffer = context.getImageData(0, 0, heightMapWidth, heightMapHeight).data;
            for (row = 0; row <= subdivisions; row++) {
                for (col = 0; col <= subdivisions; col++) {
                    var position = new BABYLON.Vector3((col * width) / subdivisions - (width / 2.0), 0, ((subdivisions - row) * height) / subdivisions - (height / 2.0));
                    var heightMapX = (((position.x + width / 2) / width) * (heightMapWidth - 1)) | 0;
                    var heightMapY = ((1.0 - (position.z + height / 2) / height) * (heightMapHeight - 1)) | 0;
                    var pos = (heightMapX + heightMapY * heightMapWidth) * 4;
                    var r = buffer[pos] / 255.0;
                    var g = buffer[pos + 1] / 255.0;
                    var b = buffer[pos + 2] / 255.0;
                    var gradient = r * 0.3 + g * 0.59 + b * 0.11;
                    position.y = minHeight + (maxHeight - minHeight) * gradient;
                    positions.push(position.x, position.y, position.z);
                    normals.push(0, 0, 0);
                    uvs.push(col / subdivisions, 1.0 - row / subdivisions);
                }
            }
            for (row = 0; row < subdivisions; row++) {
                for (col = 0; col < subdivisions; col++) {
                    indices.push(col + 1 + (row + 1) * (subdivisions + 1));
                    indices.push(col + 1 + row * (subdivisions + 1));
                    indices.push(col + row * (subdivisions + 1));
                    indices.push(col + (row + 1) * (subdivisions + 1));
                    indices.push(col + 1 + (row + 1) * (subdivisions + 1));
                    indices.push(col + row * (subdivisions + 1));
                }
            }
            BABYLON.Mesh.ComputeNormal(positions, normals, indices);
            ground.setVerticesData(positions, BABYLON.VertexBuffer.PositionKind, updatable);
            ground.setVerticesData(normals, BABYLON.VertexBuffer.NormalKind, updatable);
            ground.setVerticesData(uvs, BABYLON.VertexBuffer.UVKind, updatable);
            ground.setIndices(indices);
            ground._isReady = true;
        };
        BABYLON.Tools.LoadImage(url, onload, scene.database);
        ground._isReady = false;
        return ground;
    };
    BABYLON.Mesh.ComputeNormal = function (positions, normals, indices) {
        var positionVectors = [];
        var facesOfVertices = [];
        var index;
        for (index = 0; index < positions.length; index += 3) {
            var vector3 = new BABYLON.Vector3(positions[index], positions[index + 1], positions[index + 2]);
            positionVectors.push(vector3);
            facesOfVertices.push([]);
        }
        var facesNormals = [];
        for (index = 0; index < indices.length / 3; index++) {
            var i1 = indices[index * 3];
            var i2 = indices[index * 3 + 1];
            var i3 = indices[index * 3 + 2];
            var p1 = positionVectors[i1];
            var p2 = positionVectors[i2];
            var p3 = positionVectors[i3];
            var p1p2 = p1.subtract(p2);
            var p3p2 = p3.subtract(p2);
            facesNormals[index] = BABYLON.Vector3.Normalize(BABYLON.Vector3.Cross(p1p2, p3p2));
            facesOfVertices[i1].push(index);
            facesOfVertices[i2].push(index);
            facesOfVertices[i3].push(index);
        }
        for (index = 0; index < positionVectors.length; index++) {
            var faces = facesOfVertices[index];
            var normal = BABYLON.Vector3.Zero();
            for (var faceIndex = 0; faceIndex < faces.length; faceIndex++) {
                normal.addInPlace(facesNormals[faces[faceIndex]]);
            }
            normal = BABYLON.Vector3.Normalize(normal.scale(1.0 / faces.length));
            normals[index * 3] = normal.x;
            normals[index * 3 + 1] = normal.y;
            normals[index * 3 + 2] = normal.z;
        }
    };
    BABYLON.Mesh.MinMax = function (meshes) {
        var minVector;
        var maxVector;
        for (var i in meshes) {
            var mesh = meshes[i];
            var boundingBox = mesh.getBoundingInfo().boundingBox;
            if (!minVector) {
                minVector = boundingBox.minimumWorld;
                maxVector = boundingBox.maximumWorld;
                continue;
            }
            minVector.MinimizeInPlace(boundingBox.minimumWorld);
            maxVector.MaximizeInPlace(boundingBox.maximumWorld);
        }
        return {
            min: minVector,
            max: maxVector
        };
    };
    BABYLON.Mesh.Center = function (meshesOrMinMaxVector) {
        var minMaxVector = meshesOrMinMaxVector.min !== undefined ? meshesOrMinMaxVector : BABYLON.Mesh.MinMax(meshesOrMinMaxVector);
        return BABYLON.Vector3.Center(minMaxVector.min, minMaxVector.max);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.SubMesh = function (materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh) {
        this._mesh = mesh;
        mesh.subMeshes.push(this);
        this.materialIndex = materialIndex;
        this.verticesStart = verticesStart;
        this.verticesCount = verticesCount;
        this.indexStart = indexStart;
        this.indexCount = indexCount;
        this.refreshBoundingInfo();
    };
    BABYLON.SubMesh.prototype.getBoundingInfo = function () {
        return this._boundingInfo;
    };
    BABYLON.SubMesh.prototype.getMesh = function () {
        return this._mesh;
    };
    BABYLON.SubMesh.prototype.getMaterial = function () {
        var rootMaterial = this._mesh.material;
        if (rootMaterial && rootMaterial.getSubMaterial) {
            return rootMaterial.getSubMaterial(this.materialIndex);
        }
        if (!rootMaterial) {
            return this._mesh._scene.defaultMaterial;
        }
        return rootMaterial;
    };
    BABYLON.SubMesh.prototype.refreshBoundingInfo = function () {
        var data = this._mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        if (!data) {
            return;
        }
        var extend = BABYLON.Tools.ExtractMinAndMax(data, this.verticesStart, this.verticesCount);
        this._boundingInfo = new BABYLON.BoundingInfo(extend.minimum, extend.maximum);
    };
    BABYLON.SubMesh.prototype._checkCollision = function (collider) {
        return this._boundingInfo._checkCollision(collider);
    };
    BABYLON.SubMesh.prototype.updateBoundingInfo = function (world, scale) {
        this._boundingInfo._update(world, scale);
    };
    BABYLON.SubMesh.prototype.isInFrustum = function (frustumPlanes) {
        return this._boundingInfo.isInFrustum(frustumPlanes);
    };
    BABYLON.SubMesh.prototype.render = function () {
        this._mesh.render(this);
    };
    BABYLON.SubMesh.prototype.getLinesIndexBuffer = function (indices, engine) {
        if (!this._linesIndexBuffer) {
            var linesIndices = [];
            for (var index = this.indexStart; index < this.indexStart + this.indexCount; index += 3) {
                linesIndices.push(indices[index], indices[index + 1], indices[index + 1], indices[index + 2], indices[index + 2], indices[index]);
            }
            this._linesIndexBuffer = engine.createIndexBuffer(linesIndices);
            this.linesIndexCount = linesIndices.length;
        }
        return this._linesIndexBuffer;
    };
    BABYLON.SubMesh.prototype.canIntersects = function (ray) {
        return ray.intersectsBox(this._boundingInfo.boundingBox);
    };
    BABYLON.SubMesh.prototype.intersects = function (ray, positions, indices, fastCheck) {
        var intersectInfo = null;
        for (var index = this.indexStart; index < this.indexStart + this.indexCount; index += 3) {
            var p0 = positions[indices[index]];
            var p1 = positions[indices[index + 1]];
            var p2 = positions[indices[index + 2]];
            var currentIntersectInfo = ray.intersectsTriangle(p0, p1, p2);
            if (currentIntersectInfo) {
                if (fastCheck || !intersectInfo || currentIntersectInfo.distance < intersectInfo.distance) {
                    intersectInfo = currentIntersectInfo;
                    intersectInfo.faceId = index / 3;
                    if (fastCheck) {
                        break;
                    }
                }
            }
        }
        return intersectInfo;
    };
    BABYLON.SubMesh.prototype.clone = function (newMesh) {
        return new BABYLON.SubMesh(this.materialIndex, this.verticesStart, this.verticesCount, this.indexStart, this.indexCount, newMesh);
    };
    BABYLON.SubMesh.CreateFromIndices = function (materialIndex, startIndex, indexCount, mesh) {
        var minVertexIndex = Number.MAX_VALUE;
        var maxVertexIndex = -Number.MAX_VALUE;
        var indices = mesh.getIndices();
        for (var index = startIndex; index < startIndex + indexCount; index++) {
            var vertexIndex = indices[index];
            if (vertexIndex < minVertexIndex) minVertexIndex = vertexIndex;
            else if (vertexIndex > maxVertexIndex) maxVertexIndex = vertexIndex;
        }
        return new BABYLON.SubMesh(materialIndex, minVertexIndex, maxVertexIndex - minVertexIndex, startIndex, indexCount, mesh);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.BaseTexture = function (url, scene) {
        this._scene = scene;
        this._scene.textures.push(this);
    };
    BABYLON.BaseTexture.prototype.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_NONE;
    BABYLON.BaseTexture.prototype.hasAlpha = false;
    BABYLON.BaseTexture.prototype.level = 1;
    BABYLON.BaseTexture.prototype._texture = null;
    BABYLON.BaseTexture.prototype.onDispose = null;
    BABYLON.BaseTexture.prototype.getInternalTexture = function () {
        return this._texture;
    };
    BABYLON.BaseTexture.prototype.isReady = function () {
        if (this.delayLoadState === BABYLON.Engine.DELAYLOADSTATE_NOTLOADED) {
            return true;
        }
        if (this._texture) {
            return this._texture.isReady;
        }
        return false;
    };
    BABYLON.BaseTexture.prototype.getSize = function () {
        if (this._texture._width) {
            return {
                width: this._texture._width,
                height: this._texture._height
            };
        }
        if (this._texture._size) {
            return {
                width: this._texture._size,
                height: this._texture._size
            };
        }
        return {
            width: 0,
            height: 0
        };
    };
    BABYLON.BaseTexture.prototype.getBaseSize = function () {
        if (!this.isReady()) return {
            width: 0,
            height: 0
        };
        if (this._texture._size) {
            return {
                width: this._texture._size,
                height: this._texture._size
            };
        }
        return {
            width: this._texture._baseWidth,
            height: this._texture._baseHeight
        };
    };
    BABYLON.BaseTexture.prototype._getFromCache = function (url, noMipmap) {
        var texturesCache = this._scene.getEngine().getLoadedTexturesCache();
        for (var index = 0; index < texturesCache.length; index++) {
            var texturesCacheEntry = texturesCache[index];
            if (texturesCacheEntry.url === url && texturesCacheEntry.noMipmap === noMipmap) {
                texturesCacheEntry.references++;
                return texturesCacheEntry;
            }
        }
        return null;
    };
    BABYLON.BaseTexture.prototype.delayLoad = function () {};
    BABYLON.BaseTexture.prototype.releaseInternalTexture = function () {
        if (!this._texture) {
            return;
        }
        var texturesCache = this._scene.getEngine().getLoadedTexturesCache();
        this._texture.references--;
        if (this._texture.references == 0) {
            var index = texturesCache.indexOf(this._texture);
            texturesCache.splice(index, 1);
            this._scene.getEngine()._releaseTexture(this._texture);
            delete this._texture;
        }
    };
    BABYLON.BaseTexture.prototype.dispose = function () {
        var index = this._scene.textures.indexOf(this);
        if (index >= 0) {
            this._scene.textures.splice(index, 1);
        }
        if (this._texture === undefined) {
            return;
        }
        this.releaseInternalTexture();
        if (this.onDispose) {
            this.onDispose();
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.RenderingGroup = function (index, scene) {
        this.index = index;
        this._scene = scene;
        this._opaqueSubMeshes = new BABYLON.Tools.SmartArray(256);
        this._transparentSubMeshes = new BABYLON.Tools.SmartArray(256);
        this._alphaTestSubMeshes = new BABYLON.Tools.SmartArray(256);
    };
    BABYLON.RenderingGroup.prototype.render = function (customRenderFunction, beforeTransparents) {
        if (customRenderFunction) {
            customRenderFunction(this._opaqueSubMeshes, this._alphaTestSubMeshes, this._transparentSubMeshes, beforeTransparents);
            return true;
        }
        if (this._opaqueSubMeshes.length === 0 && this._alphaTestSubMeshes.length === 0 && this._transparentSubMeshes === 0) {
            return false;
        }
        var engine = this._scene.getEngine();
        var subIndex;
        var submesh;
        for (subIndex = 0; subIndex < this._opaqueSubMeshes.length; subIndex++) {
            submesh = this._opaqueSubMeshes.data[subIndex];
            this._activeVertices += submesh.verticesCount;
            submesh.render();
        }
        engine.setAlphaTesting(true);
        for (subIndex = 0; subIndex < this._alphaTestSubMeshes.length; subIndex++) {
            submesh = this._alphaTestSubMeshes.data[subIndex];
            this._activeVertices += submesh.verticesCount;
            submesh.render();
        }
        engine.setAlphaTesting(false);
        if (beforeTransparents) {
            beforeTransparents();
        }
        if (this._transparentSubMeshes.length) {
            for (subIndex = 0; subIndex < this._transparentSubMeshes.length; subIndex++) {
                submesh = this._transparentSubMeshes.data[subIndex];
                submesh._distanceToCamera = submesh.getBoundingInfo().boundingSphere.centerWorld.subtract(this._scene.activeCamera.position).length();
            }
            var sortedArray = this._transparentSubMeshes.data.slice(0, this._transparentSubMeshes.length);
            sortedArray.sort(function (a, b) {
                if (a._distanceToCamera < b._distanceToCamera) {
                    return 1;
                }
                if (a._distanceToCamera > b._distanceToCamera) {
                    return -1;
                }
                return 0;
            });
            engine.setAlphaMode(BABYLON.Engine.ALPHA_COMBINE);
            for (subIndex = 0; subIndex < sortedArray.length; subIndex++) {
                submesh = sortedArray[subIndex];
                this._activeVertices += submesh.verticesCount;
                submesh.render();
            }
            engine.setAlphaMode(BABYLON.Engine.ALPHA_DISABLE);
        }
        return true;
    };
    BABYLON.RenderingGroup.prototype.prepare = function () {
        this._opaqueSubMeshes.reset();
        this._transparentSubMeshes.reset();
        this._alphaTestSubMeshes.reset();
    };
    BABYLON.RenderingGroup.prototype.dispatch = function (subMesh) {
        var material = subMesh.getMaterial();
        var mesh = subMesh.getMesh();
        if (material.needAlphaBlending() || mesh.visibility < 1.0) {
            if (material.alpha > 0 || mesh.visibility < 1.0) {
                this._transparentSubMeshes.push(subMesh);
            }
        } else if (material.needAlphaTesting()) {
            this._alphaTestSubMeshes.push(subMesh);
        } else {
            this._opaqueSubMeshes.push(subMesh);
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.RenderingManager = function (scene) {
        this._scene = scene;
        this._renderingGroups = [];
    };
    BABYLON.RenderingManager.prototype._renderParticles = function (index, activeMeshes) {
        if (this._scene._activeParticleSystems.length === 0) {
            return;
        }
        var beforeParticlesDate = new Date();
        for (var particleIndex = 0; particleIndex < this._scene._activeParticleSystems.length; particleIndex++) {
            var particleSystem = this._scene._activeParticleSystems.data[particleIndex];
            if (particleSystem.renderingGroupId !== index) {
                continue;
            }
            this._clearDepthBuffer();
            if (!particleSystem.emitter.position || !activeMeshes || activeMeshes.indexOf(particleSystem.emitter) !== -1) {
                this._scene._activeParticles += particleSystem.render();
            }
        }
        this._scene._particlesDuration += new Date() - beforeParticlesDate;
    };
    BABYLON.RenderingManager.prototype._renderSprites = function (index) {
        if (this._scene.spriteManagers.length === 0) {
            return;
        }
        var beforeSpritessDate = new Date();
        for (var id = 0; id < this._scene.spriteManagers.length; id++) {
            var spriteManager = this._scene.spriteManagers[id];
            if (spriteManager.renderingGroupId === index) {
                this._clearDepthBuffer();
                spriteManager.render();
            }
        }
        this._scene._spritesDuration += new Date() - beforeSpritessDate;
    };
    BABYLON.RenderingManager.prototype._clearDepthBuffer = function () {
        if (this._depthBufferAlreadyCleaned) {
            return;
        }
        this._scene.getEngine().clear(0, false, true);
        this._depthBufferAlreadyCleaned = true;
    };
    BABYLON.RenderingManager.prototype.render = function (customRenderFunction, activeMeshes, renderParticles, renderSprites) {
        var that = this;
        for (var index = 0; index < BABYLON.RenderingManager.MAX_RENDERINGGROUPS; index++) {
            this._depthBufferAlreadyCleaned = index == 0;
            var renderingGroup = this._renderingGroups[index];
            if (renderingGroup) {
                this._clearDepthBuffer();
                if (!renderingGroup.render(customRenderFunction, function () {
                    if (renderSprites) {
                        that._renderSprites(index);
                    }
                })) {
                    this._renderingGroups.splice(index, 1);
                }
            } else if (renderSprites) {
                this._renderSprites(index);
            }
            if (renderParticles) {
                this._renderParticles(index, activeMeshes);
            }
        }
    };
    BABYLON.RenderingManager.prototype.reset = function () {
        for (var index in this._renderingGroups) {
            var renderingGroup = this._renderingGroups[index];
            renderingGroup.prepare();
        }
    };
    BABYLON.RenderingManager.prototype.dispatch = function (subMesh) {
        var mesh = subMesh.getMesh();
        var renderingGroupId = mesh.renderingGroupId || 0;
        if (!this._renderingGroups[renderingGroupId]) {
            this._renderingGroups[renderingGroupId] = new BABYLON.RenderingGroup(renderingGroupId, this._scene);
        }
        this._renderingGroups[renderingGroupId].dispatch(subMesh);
    };
    BABYLON.RenderingManager.MAX_RENDERINGGROUPS = 4;
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Texture = function (url, scene, noMipmap, invertY) {
        this._scene = scene;
        this._scene.textures.push(this);
        this.name = url;
        this.url = url;
        this._noMipmap = noMipmap;
        this._invertY = invertY;
        this._texture = this._getFromCache(url, noMipmap);
        if (!this._texture) {
            if (!scene.useDelayedTextureLoading) {
                this._texture = scene.getEngine().createTexture(url, noMipmap, invertY, scene);
            } else {
                this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_NOTLOADED;
            }
        }
        this.animations = [];
    };
    BABYLON.Texture.prototype = Object.create(BABYLON.BaseTexture.prototype);
    BABYLON.Texture.NEAREST_SAMPLINGMODE = 1;
    BABYLON.Texture.BILINEAR_SAMPLINGMODE = 2;
    BABYLON.Texture.TRILINEAR_SAMPLINGMODE = 3;
    BABYLON.Texture.EXPLICIT_MODE = 0;
    BABYLON.Texture.SPHERICAL_MODE = 1;
    BABYLON.Texture.PLANAR_MODE = 2;
    BABYLON.Texture.CUBIC_MODE = 3;
    BABYLON.Texture.PROJECTION_MODE = 4;
    BABYLON.Texture.SKYBOX_MODE = 5;
    BABYLON.Texture.CLAMP_ADDRESSMODE = 0;
    BABYLON.Texture.WRAP_ADDRESSMODE = 1;
    BABYLON.Texture.MIRROR_ADDRESSMODE = 2;
    BABYLON.Texture.prototype.uOffset = 0;
    BABYLON.Texture.prototype.vOffset = 0;
    BABYLON.Texture.prototype.uScale = 1.0;
    BABYLON.Texture.prototype.vScale = 1.0;
    BABYLON.Texture.prototype.uAng = 0;
    BABYLON.Texture.prototype.vAng = 0;
    BABYLON.Texture.prototype.wAng = 0;
    BABYLON.Texture.prototype.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
    BABYLON.Texture.prototype.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
    BABYLON.Texture.prototype.coordinatesIndex = 0;
    BABYLON.Texture.prototype.coordinatesMode = BABYLON.Texture.EXPLICIT_MODE;
    BABYLON.Texture.prototype.anisotropicFilteringLevel = 4;
    BABYLON.Texture.prototype.delayLoad = function () {
        if (this.delayLoadState != BABYLON.Engine.DELAYLOADSTATE_NOTLOADED) {
            return;
        }
        this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_LOADED;
        this._texture = this._getFromCache(this.url, this._noMipmap);
        if (!this._texture) {
            this._texture = this._scene.getEngine().createTexture(this.url, this._noMipmap, this._invertY, this._scene);
        }
    };
    BABYLON.Texture.prototype._prepareRowForTextureGeneration = function (x, y, z, t) {
        x -= this.uOffset + 0.5;
        y -= this.vOffset + 0.5;
        z -= 0.5;
        BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(x, y, z, this._rowGenerationMatrix, t);
        t.x *= this.uScale;
        t.y *= this.vScale;
        t.x += 0.5;
        t.y += 0.5;
        t.z += 0.5;
    };
    BABYLON.Texture.prototype._computeTextureMatrix = function () {
        if (this.uOffset === this._cachedUOffset && this.vOffset === this._cachedVOffset && this.uScale === this._cachedUScale && this.vScale === this._cachedVScale && this.uAng === this._cachedUAng && this.vAng === this._cachedVAng && this.wAng === this._cachedWAng) {
            return this._cachedTextureMatrix;
        }
        this._cachedUOffset = this.uOffset;
        this._cachedVOffset = this.vOffset;
        this._cachedUScale = this.uScale;
        this._cachedVScale = this.vScale;
        this._cachedUAng = this.uAng;
        this._cachedVAng = this.vAng;
        this._cachedWAng = this.wAng;
        if (!this._cachedTextureMatrix) {
            this._cachedTextureMatrix = BABYLON.Matrix.Zero();
            this._rowGenerationMatrix = new BABYLON.Matrix();
            this._t0 = BABYLON.Vector3.Zero();
            this._t1 = BABYLON.Vector3.Zero();
            this._t2 = BABYLON.Vector3.Zero();
        }
        BABYLON.Matrix.RotationYawPitchRollToRef(this.vAng, this.uAng, this.wAng, this._rowGenerationMatrix);
        this._prepareRowForTextureGeneration(0, 0, 0, this._t0);
        this._prepareRowForTextureGeneration(1.0, 0, 0, this._t1);
        this._prepareRowForTextureGeneration(0, 1.0, 0, this._t2);
        this._t1.subtractInPlace(this._t0);
        this._t2.subtractInPlace(this._t0);
        BABYLON.Matrix.IdentityToRef(this._cachedTextureMatrix);
        this._cachedTextureMatrix.m[0] = this._t1.x;
        this._cachedTextureMatrix.m[1] = this._t1.y;
        this._cachedTextureMatrix.m[2] = this._t1.z;
        this._cachedTextureMatrix.m[4] = this._t2.x;
        this._cachedTextureMatrix.m[5] = this._t2.y;
        this._cachedTextureMatrix.m[6] = this._t2.z;
        this._cachedTextureMatrix.m[8] = this._t0.x;
        this._cachedTextureMatrix.m[9] = this._t0.y;
        this._cachedTextureMatrix.m[10] = this._t0.z;
        return this._cachedTextureMatrix;
    };
    BABYLON.Texture.prototype._computeReflectionTextureMatrix = function () {
        if (this.uOffset === this._cachedUOffset && this.vOffset === this._cachedVOffset && this.uScale === this._cachedUScale && this.vScale === this._cachedVScale && this.coordinatesMode === this._cachedCoordinatesMode) {
            return this._cachedTextureMatrix;
        }
        if (!this._cachedTextureMatrix) {
            this._cachedTextureMatrix = BABYLON.Matrix.Zero();
            this._projectionModeMatrix = BABYLON.Matrix.Zero();
        }
        switch (this.coordinatesMode) {
        case BABYLON.Texture.SPHERICAL_MODE:
            BABYLON.Matrix.IdentityToRef(this._cachedTextureMatrix);
            this._cachedTextureMatrix[0] = -0.5 * this.uScale;
            this._cachedTextureMatrix[5] = -0.5 * this.vScale;
            this._cachedTextureMatrix[12] = 0.5 + this.uOffset;
            this._cachedTextureMatrix[13] = 0.5 + this.vOffset;
            break;
        case BABYLON.Texture.PLANAR_MODE:
            BABYLON.Matrix.IdentityToRef(this._cachedTextureMatrix);
            this._cachedTextureMatrix[0] = this.uScale;
            this._cachedTextureMatrix[5] = this.vScale;
            this._cachedTextureMatrix[12] = this.uOffset;
            this._cachedTextureMatrix[13] = this.vOffset;
            break;
        case BABYLON.Texture.PROJECTION_MODE:
            BABYLON.Matrix.IdentityToRef(this._projectionModeMatrix);
            this._projectionModeMatrix.m[0] = 0.5;
            this._projectionModeMatrix.m[5] = -0.5;
            this._projectionModeMatrix.m[10] = 0.0;
            this._projectionModeMatrix.m[12] = 0.5;
            this._projectionModeMatrix.m[13] = 0.5;
            this._projectionModeMatrix.m[14] = 1.0;
            this._projectionModeMatrix.m[15] = 1.0;
            this._scene.getProjectionMatrix().multiplyToRef(this._projectionModeMatrix, this._cachedTextureMatrix);
            break;
        default:
            BABYLON.Matrix.IdentityToRef(this._cachedTextureMatrix);
            break;
        }
        return this._cachedTextureMatrix;
    };
    BABYLON.Texture.prototype.clone = function () {
        var newTexture = new BABYLON.Texture(this._texture.url, this._scene, this._noMipmap, this._invertY);
        newTexture.hasAlpha = this.hasAlpha;
        newTexture.level = this.level;
        newTexture.uOffset = this.uOffset;
        newTexture.vOffset = this.vOffset;
        newTexture.uScale = this.uScale;
        newTexture.vScale = this.vScale;
        newTexture.uAng = this.uAng;
        newTexture.vAng = this.vAng;
        newTexture.wAng = this.wAng;
        newTexture.wrapU = this.wrapU;
        newTexture.wrapV = this.wrapV;
        newTexture.coordinatesIndex = this.coordinatesIndex;
        newTexture.coordinatesMode = this.coordinatesMode;
        return newTexture;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.CubeTexture = function (rootUrl, scene, extensions, noMipmap) {
        this._scene = scene;
        this._scene.textures.push(this);
        this.name = rootUrl;
        this.url = rootUrl;
        this._noMipmap = noMipmap;
        this.hasAlpha = false;
        this.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
        this._texture = this._getFromCache(rootUrl, noMipmap);
        if (!extensions) {
            extensions = ["_px.jpg", "_py.jpg", "_pz.jpg", "_nx.jpg", "_ny.jpg", "_nz.jpg"];
        }
        this._extensions = extensions;
        if (!this._texture) {
            if (!scene.useDelayedTextureLoading) {
                this._texture = scene.getEngine().createCubeTexture(rootUrl, scene, extensions, noMipmap);
            } else {
                this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_NOTLOADED;
            }
        }
        this.isCube = true;
        this._textureMatrix = BABYLON.Matrix.Identity();
    };
    BABYLON.CubeTexture.prototype = Object.create(BABYLON.BaseTexture.prototype);
    BABYLON.CubeTexture.prototype.delayLoad = function () {
        if (this.delayLoadState != BABYLON.Engine.DELAYLOADSTATE_NOTLOADED) {
            return;
        }
        this.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_LOADED;
        this._texture = this._getFromCache(this.url, this._noMipmap);
        if (!this._texture) {
            this._texture = this._scene.getEngine().createCubeTexture(this.url, this._scene, this._extensions);
        }
    };
    BABYLON.CubeTexture.prototype._computeReflectionTextureMatrix = function () {
        return this._textureMatrix;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.RenderTargetTexture = function (name, size, scene, generateMipMaps) {
        this._scene = scene;
        this._scene.textures.push(this);
        this.name = name;
        this._size = size;
        this._generateMipMaps = generateMipMaps;
        this._texture = scene.getEngine().createRenderTargetTexture(size, generateMipMaps);
        this.renderList = [];
        this._renderingManager = new BABYLON.RenderingManager(scene);
    };
    BABYLON.RenderTargetTexture.prototype = Object.create(BABYLON.Texture.prototype);
    BABYLON.RenderTargetTexture.prototype.renderParticles = true;
    BABYLON.RenderTargetTexture.prototype.renderSprites = false;
    BABYLON.RenderTargetTexture.prototype.isRenderTarget = true;
    BABYLON.RenderTargetTexture.prototype.coordinatesMode = BABYLON.Texture.PROJECTION_MODE;
    BABYLON.RenderTargetTexture.prototype.onBeforeRender = null;
    BABYLON.RenderTargetTexture.prototype.onAfterRender = null;
    BABYLON.RenderTargetTexture.prototype.resize = function (size, generateMipMaps) {
        this.releaseInternalTexture();
        this._texture = this._scene.getEngine().createRenderTargetTexture(size, generateMipMaps);
    };
    BABYLON.RenderTargetTexture.prototype.render = function () {
        if (this.onBeforeRender) {
            this.onBeforeRender();
        }
        var scene = this._scene;
        var engine = scene.getEngine();
        if (this._waitingRenderList) {
            this.renderList = [];
            for (var index = 0; index < this._waitingRenderList.length; index++) {
                var id = this._waitingRenderList[index];
                this.renderList.push(this._scene.getMeshByID(id));
            }
            delete this._waitingRenderList;
        }
        if (!this.renderList || this.renderList.length == 0) {
            if (this.onAfterRender) {
                this.onAfterRender();
            }
            return;
        }
        engine.bindFramebuffer(this._texture);
        engine.clear(scene.clearColor, true, true);
        this._renderingManager.reset();
        for (var meshIndex = 0; meshIndex < this.renderList.length; meshIndex++) {
            var mesh = this.renderList[meshIndex];
            if (mesh && mesh.isEnabled() && mesh.isVisible) {
                for (var subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
                    var subMesh = mesh.subMeshes[subIndex];
                    scene._activeVertices += subMesh.verticesCount;
                    this._renderingManager.dispatch(subMesh);
                }
            }
        }
        this._renderingManager.render(this.customRenderFunction, this.renderList, this.renderParticles, this.renderSprites);
        engine.unBindFramebuffer(this._texture);
        if (this.onAfterRender) {
            this.onAfterRender();
        }
    };
    BABYLON.RenderTargetTexture.prototype.clone = function () {
        var textureSize = this.getSize();
        var newTexture = new BABYLON.RenderTargetTexture(this.name, textureSize.width, this._scene, this._generateMipMaps);
        newTexture.hasAlpha = this.hasAlpha;
        newTexture.level = this.level;
        newTexture.coordinatesMode = this.coordinatesMode;
        newTexture.renderList = this.renderList.slice(0);
        return newTexture;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.MirrorTexture = function (name, size, scene, generateMipMaps) {
        BABYLON.RenderTargetTexture.call(this, name, size, scene, generateMipMaps);
        this._transformMatrix = BABYLON.Matrix.Zero();
        this._mirrorMatrix = BABYLON.Matrix.Zero();
    };
    BABYLON.MirrorTexture.prototype = Object.create(BABYLON.RenderTargetTexture.prototype);
    BABYLON.MirrorTexture.prototype.mirrorPlane = new BABYLON.Plane(0, 1, 0, 1);
    BABYLON.MirrorTexture.prototype.onBeforeRender = function () {
        var scene = this._scene;
        BABYLON.Matrix.ReflectionToRef(this.mirrorPlane, this._mirrorMatrix);
        this._savedViewMatrix = scene.getViewMatrix();
        this._mirrorMatrix.multiplyToRef(this._savedViewMatrix, this._transformMatrix);
        scene.setTransformMatrix(this._transformMatrix, scene.getProjectionMatrix());
        BABYLON.clipPlane = this.mirrorPlane;
        scene.getEngine().cullBackFaces = false;
    };
    BABYLON.MirrorTexture.prototype.onAfterRender = function () {
        var scene = this._scene;
        scene.setTransformMatrix(this._savedViewMatrix, scene.getProjectionMatrix());
        scene.getEngine().cullBackFaces = true;
        delete BABYLON.clipPlane;
    };
    BABYLON.MirrorTexture.prototype.clone = function () {
        var textureSize = this.getSize();
        var newTexture = new BABYLON.MirrorTexture(this.name, textureSize.width, this._scene, this._generateMipMaps);
        newTexture.hasAlpha = this.hasAlpha;
        newTexture.level = this.level;
        newTexture.mirrorPlane = this.mirrorPlane.clone();
        newTexture.renderList = this.renderList.slice(0);
        return newTexture;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.DynamicTexture = function (name, options, scene, generateMipMaps) {
        this._scene = scene;
        this._scene.textures.push(this);
        this.name = name;
        this.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        this.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        this._generateMipMaps = generateMipMaps;
        if (options.getContext) {
            this._canvas = options;
            this._texture = scene.getEngine().createDynamicTexture(options.width, options.height, generateMipMaps);
        } else {
            this._canvas = document.createElement("canvas");
            if (options.width) {
                this._texture = scene.getEngine().createDynamicTexture(options.width, options.height, generateMipMaps);
            } else {
                this._texture = scene.getEngine().createDynamicTexture(options, options, generateMipMaps);
            }
        }
        var textureSize = this.getSize();
        this._canvas.width = textureSize.width;
        this._canvas.height = textureSize.height;
        this._context = this._canvas.getContext("2d");
    };
    BABYLON.DynamicTexture.prototype = Object.create(BABYLON.Texture.prototype);
    BABYLON.DynamicTexture.prototype.getContext = function () {
        return this._context;
    };
    BABYLON.DynamicTexture.prototype.update = function (invertY) {
        this._scene.getEngine().updateDynamicTexture(this._texture, this._canvas, invertY === undefined ? true : invertY);
    };
    BABYLON.DynamicTexture.prototype.drawText = function (text, x, y, font, color, clearColor, invertY) {
        var size = this.getSize();
        if (clearColor) {
            this._context.fillStyle = clearColor;
            this._context.fillRect(0, 0, size.width, size.height);
        }
        this._context.font = font;
        if (x === null) {
            var textSize = this._context.measureText(text);
            x = (size.width - textSize.width) / 2;
        }
        this._context.fillStyle = color;
        this._context.fillText(text, x, y);
        this.update(invertY);
    };
    BABYLON.DynamicTexture.prototype.clone = function () {
        var textureSize = this.getSize();
        var newTexture = new BABYLON.DynamicTexture(this.name, textureSize.width, this._scene, this._generateMipMaps);
        newTexture.hasAlpha = this.hasAlpha;
        newTexture.level = this.level;
        newTexture.wrapU = this.wrapU;
        newTexture.wrapV = this.wrapV;
        return newTexture;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.VideoTexture = function (name, urls, size, scene, generateMipMaps, invertY) {
        this._scene = scene;
        this._scene.textures.push(this);
        this.name = name;
        this._invertY = invertY;
        this.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
        this.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
        this._texture = scene.getEngine().createDynamicTexture(size, size, generateMipMaps);
        var textureSize = this.getSize();
        this.video = document.createElement("video");
        this.video.width = textureSize.width;
        this.video.height = textureSize.height;
        this.video.autoplay = false;
        this.video.loop = true;
        this.video.preload = true;
        this._autoLaunch = true;
        var that = this;
        this.video.addEventListener("canplaythrough", function () {
            if (that._texture) {
                that._texture.isReady = true;
            }
        });
        urls.forEach(function (url) {
            var source = document.createElement("source");
            source.src = url;
            that.video.appendChild(source);
        });
        this._lastUpdate = new Date();
    };
    BABYLON.VideoTexture.prototype = Object.create(BABYLON.Texture.prototype);
    BABYLON.VideoTexture.prototype._update = function () {
        if (this._autoLaunch) {
            this._autoLaunch = false;
            this.video.play();
        }
        var now = new Date();
        if (now - this._lastUpdate < 15) {
            return false;
        }
        this._lastUpdate = now;
        this._scene.getEngine().updateVideoTexture(this._texture, this.video, this._invertY);
        return true;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Effect = function (baseName, attributesNames, uniformsNames, samplers, engine, defines, optionalDefines) {
        this._engine = engine;
        this.name = baseName;
        this.defines = defines;
        this._uniformsNames = uniformsNames.concat(samplers);
        this._samplers = samplers;
        this._isReady = false;
        this._compilationError = "";
        this._attributesNames = attributesNames;
        var vertexSource;
        var fragmentSource;
        if (baseName.vertexElement) {
            vertexSource = document.getElementById(baseName.vertexElement);
            fragmentSource = document.getElementById(baseName.fragmentElement);
        } else {
            vertexSource = baseName.vertexElement || baseName.vertex || baseName;
            fragmentSource = baseName.fragmentElement || baseName.fragment || baseName;
        }
        var that = this;
        this._loadVertexShader(vertexSource, function (vertexCode) {
            that._loadFragmentShader(fragmentSource, function (fragmentCode) {
                that._prepareEffect(vertexCode, fragmentCode, attributesNames, defines, optionalDefines);
            });
        });
        this._valueCache = [];
    };
    BABYLON.Effect.prototype.isReady = function () {
        return this._isReady;
    };
    BABYLON.Effect.prototype.getProgram = function () {
        return this._program;
    };
    BABYLON.Effect.prototype.getAttributesNames = function () {
        return this._attributesNames;
    };
    BABYLON.Effect.prototype.getAttribute = function (index) {
        return this._attributes[index];
    };
    BABYLON.Effect.prototype.getAttributesCount = function () {
        return this._attributes.length;
    };
    BABYLON.Effect.prototype.getUniformIndex = function (uniformName) {
        return this._uniformsNames.indexOf(uniformName);
    };
    BABYLON.Effect.prototype.getUniform = function (uniformName) {
        return this._uniforms[this._uniformsNames.indexOf(uniformName)];
    };
    BABYLON.Effect.prototype.getSamplers = function () {
        return this._samplers;
    };
    BABYLON.Effect.prototype.getCompilationError = function () {
        return this._compilationError;
    };
    BABYLON.Effect.prototype._loadVertexShader = function (vertex, callback) {
        if (vertex instanceof HTMLElement) {
            var vertexCode = BABYLON.Tools.GetDOMTextContent(vertex);
            callback(vertexCode);
            return;
        }
        if (BABYLON.Effect.ShadersStore[vertex + "VertexShader"]) {
            callback(BABYLON.Effect.ShadersStore[vertex + "VertexShader"]);
            return;
        }
        var vertexShaderUrl;
        if (vertex[0] === ".") {
            vertexShaderUrl = vertex;
        } else {
            vertexShaderUrl = BABYLON.Engine.ShadersRepository + vertex;
        }
        BABYLON.Tools.LoadFile(vertexShaderUrl + ".vertex.fx", callback);
    };
    BABYLON.Effect.prototype._loadFragmentShader = function (fragment, callback) {
        if (fragment instanceof HTMLElement) {
            var fragmentCode = BABYLON.Tools.GetDOMTextContent(fragment);
            callback(fragmentCode);
            return;
        }
        if (BABYLON.Effect.ShadersStore[fragment + "PixelShader"]) {
            callback(BABYLON.Effect.ShadersStore[fragment + "PixelShader"]);
            return;
        }
        var fragmentShaderUrl;
        if (fragment[0] === ".") {
            fragmentShaderUrl = fragment;
        } else {
            fragmentShaderUrl = BABYLON.Engine.ShadersRepository + fragment;
        }
        BABYLON.Tools.LoadFile(fragmentShaderUrl + ".fragment.fx", callback);
    };
    BABYLON.Effect.prototype._prepareEffect = function (vertexSourceCode, fragmentSourceCode, attributesNames, defines, optionalDefines, useFallback) {
        try {
            var engine = this._engine;
            this._program = engine.createShaderProgram(vertexSourceCode, fragmentSourceCode, defines);
            this._uniforms = engine.getUniforms(this._program, this._uniformsNames);
            this._attributes = engine.getAttributes(this._program, attributesNames);
            for (var index = 0; index < this._samplers.length; index++) {
                var sampler = this.getUniform(this._samplers[index]);
                if (sampler == null) {
                    this._samplers.splice(index, 1);
                    index--;
                }
            }
            engine.bindSamplers(this);
            this._isReady = true;
        } catch (e) {
            if (!useFallback && optionalDefines) {
                for (var index = 0; index < optionalDefines.length; index++) {
                    defines = defines.replace(optionalDefines[index], "");
                }
                this._prepareEffect(vertexSourceCode, fragmentSourceCode, attributesNames, defines, optionalDefines, true);
            } else {
                console.error("Unable to compile effect: " + this.name);
                console.error("Defines: " + defines);
                console.error("Optional defines: " + optionalDefines);
                this._compilationError = e.message;
            }
        }
    };
    BABYLON.Effect.prototype._bindTexture = function (channel, texture) {
        this._engine._bindTexture(this._samplers.indexOf(channel), texture);
    };
    BABYLON.Effect.prototype.setTexture = function (channel, texture) {
        this._engine.setTexture(this._samplers.indexOf(channel), texture);
    };
    BABYLON.Effect.prototype.setTextureFromPostProcess = function (channel, postProcess) {
        this._engine.setTextureFromPostProcess(this._samplers.indexOf(channel), postProcess);
    };
    BABYLON.Effect.prototype._cacheFloat2 = function (uniformName, x, y) {
        if (!this._valueCache[uniformName]) {
            this._valueCache[uniformName] = [x, y];
            return;
        }
        this._valueCache[uniformName][0] = x;
        this._valueCache[uniformName][1] = y;
    };
    BABYLON.Effect.prototype._cacheFloat3 = function (uniformName, x, y, z) {
        if (!this._valueCache[uniformName]) {
            this._valueCache[uniformName] = [x, y, z];
            return;
        }
        this._valueCache[uniformName][0] = x;
        this._valueCache[uniformName][1] = y;
        this._valueCache[uniformName][2] = z;
    };
    BABYLON.Effect.prototype._cacheFloat4 = function (uniformName, x, y, z, w) {
        if (!this._valueCache[uniformName]) {
            this._valueCache[uniformName] = [x, y, z, w];
            return;
        }
        this._valueCache[uniformName][0] = x;
        this._valueCache[uniformName][1] = y;
        this._valueCache[uniformName][2] = z;
        this._valueCache[uniformName][3] = w;
    };
    BABYLON.Effect.prototype.setArray = function (uniformName, array) {
        this._engine.setArray(this.getUniform(uniformName), array);
        return this;
    };
    BABYLON.Effect.prototype.setMatrices = function (uniformName, matrices) {
        this._engine.setMatrices(this.getUniform(uniformName), matrices);
        return this;
    };
    BABYLON.Effect.prototype.setMatrix = function (uniformName, matrix) {
        this._engine.setMatrix(this.getUniform(uniformName), matrix);
        return this;
    };
    BABYLON.Effect.prototype.setFloat = function (uniformName, value) {
        if (this._valueCache[uniformName] && this._valueCache[uniformName] === value) return this;
        this._valueCache[uniformName] = value;
        this._engine.setFloat(this.getUniform(uniformName), value);
        return this;
    };
    BABYLON.Effect.prototype.setBool = function (uniformName, bool) {
        if (this._valueCache[uniformName] && this._valueCache[uniformName] === bool) return this;
        this._valueCache[uniformName] = bool;
        this._engine.setBool(this.getUniform(uniformName), bool);
        return this;
    };
    BABYLON.Effect.prototype.setVector2 = function (uniformName, vector2) {
        if (this._valueCache[uniformName] && this._valueCache[uniformName][0] == vector2.x && this._valueCache[uniformName][1] == vector2.y) return this;
        this._cacheFloat2(uniformName, vector2.x, vector2.y);
        this._engine.setFloat2(this.getUniform(uniformName), vector2.x, vector2.y);
        return this;
    };
    BABYLON.Effect.prototype.setFloat2 = function (uniformName, x, y) {
        if (this._valueCache[uniformName] && this._valueCache[uniformName][0] == x && this._valueCache[uniformName][1] == y) return this;
        this._cacheFloat2(uniformName, x, y);
        this._engine.setFloat2(this.getUniform(uniformName), x, y);
        return this;
    };
    BABYLON.Effect.prototype.setVector3 = function (uniformName, vector3) {
        if (this._valueCache[uniformName] && this._valueCache[uniformName][0] == vector3.x && this._valueCache[uniformName][1] == vector3.y && this._valueCache[uniformName][2] == vector3.z) return this;
        this._cacheFloat3(uniformName, vector3.x, vector3.y, vector3.z);
        this._engine.setFloat3(this.getUniform(uniformName), vector3.x, vector3.y, vector3.z);
        return this;
    };
    BABYLON.Effect.prototype.setFloat3 = function (uniformName, x, y, z) {
        if (this._valueCache[uniformName] && this._valueCache[uniformName][0] == x && this._valueCache[uniformName][1] == y && this._valueCache[uniformName][2] == z) return this;
        this._cacheFloat3(uniformName, x, y, z);
        this._engine.setFloat3(this.getUniform(uniformName), x, y, z);
        return this;
    };
    BABYLON.Effect.prototype.setFloat4 = function (uniformName, x, y, z, w) {
        if (this._valueCache[uniformName] && this._valueCache[uniformName][0] == x && this._valueCache[uniformName][1] == y && this._valueCache[uniformName][2] == z && this._valueCache[uniformName][3] == w) return this;
        this._cacheFloat4(uniformName, x, y, z, w);
        this._engine.setFloat4(this.getUniform(uniformName), x, y, z, w);
        return this;
    };
    BABYLON.Effect.prototype.setColor3 = function (uniformName, color3) {
        if (this._valueCache[uniformName] && this._valueCache[uniformName][0] == color3.r && this._valueCache[uniformName][1] == color3.g && this._valueCache[uniformName][2] == color3.b) return this;
        this._cacheFloat3(uniformName, color3.r, color3.g, color3.b);
        this._engine.setColor3(this.getUniform(uniformName), color3);
        return this;
    };
    BABYLON.Effect.prototype.setColor4 = function (uniformName, color3, alpha) {
        if (this._valueCache[uniformName] && this._valueCache[uniformName][0] == color3.r && this._valueCache[uniformName][1] == color3.g && this._valueCache[uniformName][2] == color3.b && this._valueCache[uniformName][3] == alpha) return this;
        this._cacheFloat4(uniformName, color3.r, color3.g, color3.b, alpha);
        this._engine.setColor4(this.getUniform(uniformName), color3, alpha);
        return this;
    };
    BABYLON.Effect.ShadersStore = {
        blackAndWhitePixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Samplers\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\n\nvoid main(void) \n{\n float luminance = dot(texture2D(textureSampler, vUV).rgb, vec3(0.3, 0.59, 0.11));\n gl_FragColor = vec4(luminance, luminance, luminance, 1.0);\n}",
        blurPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Samplers\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\n\n// Parameters\nuniform vec2 screenSize;\nuniform vec2 direction;\nuniform float blurWidth;\n\nvoid main(void)\n{\n float weights[7];\n weights[0] = 0.05;\n    weights[1] = 0.1;\n weights[2] = 0.2;\n weights[3] = 0.3;\n weights[4] = 0.2;\n weights[5] = 0.1;\n weights[6] = 0.05;\n\n  vec2 texelSize = vec2(1.0 / screenSize.x, 1.0 / screenSize.y);\n    vec2 texelStep = texelSize * direction * blurWidth;\n   vec2 start = vUV - 3.0 * texelStep;\n\n vec4 baseColor = vec4(0., 0., 0., 0.);\n    vec2 texelOffset = vec2(0., 0.);\n\n    for (int i = 0; i < 7; i++)\n   {\n     baseColor += texture2D(textureSampler, start + texelOffset) * weights[i];\n     texelOffset += texelStep;\n }\n\n   gl_FragColor = baseColor;\n}",
        convolutionPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Samplers\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\n\nuniform vec2 screenSize;\nuniform float kernel[9];\n\nvoid main(void)\n{\n  vec2 onePixel = vec2(1.0, 1.0) / screenSize;\n  vec4 colorSum =\n       texture2D(textureSampler, vUV + onePixel * vec2(-1, -1)) * kernel[0] +\n        texture2D(textureSampler, vUV + onePixel * vec2(0, -1)) * kernel[1] +\n     texture2D(textureSampler, vUV + onePixel * vec2(1, -1)) * kernel[2] +\n     texture2D(textureSampler, vUV + onePixel * vec2(-1, 0)) * kernel[3] +\n     texture2D(textureSampler, vUV + onePixel * vec2(0, 0)) * kernel[4] +\n      texture2D(textureSampler, vUV + onePixel * vec2(1, 0)) * kernel[5] +\n      texture2D(textureSampler, vUV + onePixel * vec2(-1, 1)) * kernel[6] +\n     texture2D(textureSampler, vUV + onePixel * vec2(0, 1)) * kernel[7] +\n      texture2D(textureSampler, vUV + onePixel * vec2(1, 1)) * kernel[8];\n\n float kernelWeight =\n      kernel[0] +\n       kernel[1] +\n       kernel[2] +\n       kernel[3] +\n       kernel[4] +\n       kernel[5] +\n       kernel[6] +\n       kernel[7] +\n       kernel[8];\n\n  if (kernelWeight <= 0.0) {\n        kernelWeight = 1.0;\n   }\n\n   gl_FragColor = vec4((colorSum / kernelWeight).rgb, 1);\n}",
        defaultPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n#define MAP_EXPLICIT 0.\n#define MAP_SPHERICAL   1.\n#define MAP_PLANAR      2.\n#define MAP_CUBIC       3.\n#define MAP_PROJECTION  4.\n#define MAP_SKYBOX      5.\n\n// Constants\nuniform vec3 vEyePosition;\nuniform vec3 vAmbientColor;\nuniform vec4 vDiffuseColor;\nuniform vec4 vSpecularColor;\nuniform vec3 vEmissiveColor;\n\n// Input\nvarying vec3 vPositionW;\nvarying vec3 vNormalW;\n\n#ifdef VERTEXCOLOR\nvarying vec3 vColor;\n#endif\n\n// Lights\n#ifdef LIGHT0\nuniform vec4 vLightData0;\nuniform vec3 vLightDiffuse0;\nuniform vec3 vLightSpecular0;\n#ifdef SHADOW0\nvarying vec4 vPositionFromLight0;\nuniform sampler2D shadowSampler0;\n#endif\n#ifdef SPOTLIGHT0\nuniform vec4 vLightDirection0;\n#endif\n#ifdef HEMILIGHT0\nuniform vec3 vLightGround0;\n#endif\n#endif\n\n#ifdef LIGHT1\nuniform vec4 vLightData1;\nuniform vec3 vLightDiffuse1;\nuniform vec3 vLightSpecular1;\n#ifdef SHADOW1\nvarying vec4 vPositionFromLight1;\nuniform sampler2D shadowSampler1;\n#endif\n#ifdef SPOTLIGHT1\nuniform vec4 vLightDirection1;\n#endif\n#ifdef HEMILIGHT1\nuniform vec3 vLightGround1;\n#endif\n#endif\n\n#ifdef LIGHT2\nuniform vec4 vLightData2;\nuniform vec3 vLightDiffuse2;\nuniform vec3 vLightSpecular2;\n#ifdef SHADOW2\nvarying vec4 vPositionFromLight2;\nuniform sampler2D shadowSampler2;\n#endif\n#ifdef SPOTLIGHT2\nuniform vec4 vLightDirection2;\n#endif\n#ifdef HEMILIGHT2\nuniform vec3 vLightGround2;\n#endif\n#endif\n\n#ifdef LIGHT3\nuniform vec4 vLightData3;\nuniform vec3 vLightDiffuse3;\nuniform vec3 vLightSpecular3;\n#ifdef SHADOW3\nvarying vec4 vPositionFromLight3;\nuniform sampler2D shadowSampler3;\n#endif\n#ifdef SPOTLIGHT3\nuniform vec4 vLightDirection3;\n#endif\n#ifdef HEMILIGHT3\nuniform vec3 vLightGround3;\n#endif\n#endif\n\n// Samplers\n#ifdef DIFFUSE\nvarying vec2 vDiffuseUV;\nuniform sampler2D diffuseSampler;\nuniform vec2 vDiffuseInfos;\n#endif\n\n#ifdef AMBIENT\nvarying vec2 vAmbientUV;\nuniform sampler2D ambientSampler;\nuniform vec2 vAmbientInfos;\n#endif\n\n#ifdef OPACITY    \nvarying vec2 vOpacityUV;\nuniform sampler2D opacitySampler;\nuniform vec2 vOpacityInfos;\n#endif\n\n#ifdef EMISSIVE\nvarying vec2 vEmissiveUV;\nuniform vec2 vEmissiveInfos;\nuniform sampler2D emissiveSampler;\n#endif\n\n#ifdef SPECULAR\nvarying vec2 vSpecularUV;\nuniform vec2 vSpecularInfos;\nuniform sampler2D specularSampler;\n#endif\n\n// Reflection\n#ifdef REFLECTION\nvarying vec3 vPositionUVW;\nuniform samplerCube reflectionCubeSampler;\nuniform sampler2D reflection2DSampler;\nuniform vec3 vReflectionInfos;\nuniform mat4 reflectionMatrix;\nuniform mat4 view;\n\nvec3 computeReflectionCoords(float mode, vec4 worldPos, vec3 worldNormal)\n{\n    if (mode == MAP_SPHERICAL)\n    {\n     vec3 coords = vec3(view * vec4(worldNormal, 0.0));\n\n      return vec3(reflectionMatrix * vec4(coords, 1.0));\n    }\n else if (mode == MAP_PLANAR)\n  {\n     vec3 viewDir = worldPos.xyz - vEyePosition;\n       vec3 coords = normalize(reflect(viewDir, worldNormal));\n\n     return vec3(reflectionMatrix * vec4(coords, 1));\n  }\n else if (mode == MAP_CUBIC)\n   {\n     vec3 viewDir = worldPos.xyz - vEyePosition;\n       vec3 coords = reflect(viewDir, worldNormal);\n\n        return vec3(reflectionMatrix * vec4(coords, 0));\n  }\n else if (mode == MAP_PROJECTION)\n  {\n     return vec3(reflectionMatrix * (view * worldPos));\n    }\n else if (mode == MAP_SKYBOX)\n  {\n     return vPositionUVW;\n  }\n\n   return vec3(0, 0, 0);\n}\n#endif\n\n// Shadows\n#ifdef SHADOWS\n\nfloat unpack(vec4 color)\n{\n const vec4 bitShift = vec4(1. / (255. * 255. * 255.), 1. / (255. * 255.), 1. / 255., 1.);\n return dot(color, bitShift);\n}\n\nfloat unpackHalf(vec2 color)\n{\n    return color.x + (color.y / 255.0);\n}\n\nfloat computeShadow(vec4 vPositionFromLight, sampler2D shadowSampler)\n{\n    vec3 depth = vPositionFromLight.xyz / vPositionFromLight.w;\n   vec2 uv = 0.5 * depth.xy + vec2(0.5, 0.5);\n\n  if (uv.x < 0. || uv.x > 1.0 || uv.y < 0. || uv.y > 1.0)\n   {\n     return 1.0;\n   }\n\n   float shadow = unpack(texture2D(shadowSampler, uv));\n\n    if (depth.z > shadow)\n {\n     return 0.;\n    }\n return 1.;\n}\n\n// Thanks to http://devmaster.net/\nfloat ChebychevInequality(vec2 moments, float t)\n{\n  if (t <= moments.x)\n   {\n     return 1.0;\n   }\n\n   float variance = moments.y - (moments.x * moments.x);\n variance = max(variance, 0.);\n\n   float d = t - moments.x;\n  return variance / (variance + d * d);\n}\n\nfloat computeShadowWithVSM(vec4 vPositionFromLight, sampler2D shadowSampler)\n{\n   vec3 depth = vPositionFromLight.xyz / vPositionFromLight.w;\n   vec2 uv = 0.5 * depth.xy + vec2(0.5, 0.5);\n\n  if (uv.x < 0. || uv.x > 1.0 || uv.y < 0. || uv.y > 1.0)\n   {\n     return 1.0;\n   }\n\n   vec4 texel = texture2D(shadowSampler, uv);\n\n  vec2 moments = vec2(unpackHalf(texel.xy), unpackHalf(texel.zw));\n  return clamp(1.3 - ChebychevInequality(moments, depth.z), 0., 1.0);\n}\n#endif\n\n// Bump\n#ifdef BUMP\n#extension GL_OES_standard_derivatives : enable\nvarying vec2 vBumpUV;\nuniform vec2 vBumpInfos;\nuniform sampler2D bumpSampler;\n\n// Thanks to http://www.thetenthplanet.de/archives/1180\nmat3 cotangent_frame(vec3 normal, vec3 p, vec2 uv)\n{\n    // get edge vectors of the pixel triangle\n vec3 dp1 = dFdx(p);\n   vec3 dp2 = dFdy(p);\n   vec2 duv1 = dFdx(uv);\n vec2 duv2 = dFdy(uv);\n\n   // solve the linear system\n    vec3 dp2perp = cross(dp2, normal);\n    vec3 dp1perp = cross(normal, dp1);\n    vec3 tangent = dp2perp * duv1.x + dp1perp * duv2.x;\n   vec3 binormal = dp2perp * duv1.y + dp1perp * duv2.y;\n\n    // construct a scale-invariant frame \n float invmax = inversesqrt(max(dot(tangent, tangent), dot(binormal, binormal)));\n  return mat3(tangent * invmax, binormal * invmax, normal);\n}\n\nvec3 perturbNormal(vec3 viewDir)\n{\n   vec3 map = texture2D(bumpSampler, vBumpUV).xyz * vBumpInfos.y;\n    map = map * 255. / 127. - 128. / 127.;\n    mat3 TBN = cotangent_frame(vNormalW, -viewDir, vBumpUV);\n  return normalize(TBN * map);\n}\n#endif\n\n#ifdef CLIPPLANE\nvarying float fClipDistance;\n#endif\n\n// Fog\n#ifdef FOG\n\n#define FOGMODE_NONE    0.\n#define FOGMODE_EXP     1.\n#define FOGMODE_EXP2    2.\n#define FOGMODE_LINEAR  3.\n#define E 2.71828\n\nuniform vec4 vFogInfos;\nuniform vec3 vFogColor;\nvarying float fFogDistance;\n\nfloat CalcFogFactor()\n{\n float fogCoeff = 1.0;\n float fogStart = vFogInfos.y;\n float fogEnd = vFogInfos.z;\n   float fogDensity = vFogInfos.w;\n\n if (FOGMODE_LINEAR == vFogInfos.x)\n    {\n     fogCoeff = (fogEnd - fFogDistance) / (fogEnd - fogStart);\n }\n else if (FOGMODE_EXP == vFogInfos.x)\n  {\n     fogCoeff = 1.0 / pow(E, fFogDistance * fogDensity);\n   }\n else if (FOGMODE_EXP2 == vFogInfos.x)\n {\n     fogCoeff = 1.0 / pow(E, fFogDistance * fFogDistance * fogDensity * fogDensity);\n   }\n\n   return clamp(fogCoeff, 0.0, 1.0);\n}\n#endif\n\n// Light Computing\nstruct lightingInfo\n{\n    vec3 diffuse;\n vec3 specular;\n};\n\nlightingInfo computeLighting(vec3 viewDirectionW, vec3 vNormal, vec4 lightData, vec3 diffuseColor, vec3 specularColor) {\n    lightingInfo result;\n\n    vec3 lightVectorW;\n    if (lightData.w == 0.)\n    {\n     lightVectorW = normalize(lightData.xyz - vPositionW);\n }\n else\n  {\n     lightVectorW = normalize(-lightData.xyz);\n }\n\n   // diffuse\n    float ndl = max(0., dot(vNormal, lightVectorW));\n\n    // Specular\n   vec3 angleW = normalize(viewDirectionW + lightVectorW);\n   float specComp = max(0., dot(vNormal, angleW));\n   specComp = pow(specComp, vSpecularColor.a);\n\n result.diffuse = ndl * diffuseColor;\n  result.specular = specComp * specularColor;\n\n return result;\n}\n\nlightingInfo computeSpotLighting(vec3 viewDirectionW, vec3 vNormal, vec4 lightData, vec4 lightDirection, vec3 diffuseColor, vec3 specularColor) {\n    lightingInfo result;\n\n    vec3 lightVectorW = normalize(lightData.xyz - vPositionW);\n\n  // diffuse\n    float cosAngle = max(0., dot(-lightDirection.xyz, lightVectorW));\n float spotAtten = 0.0;\n\n  if (cosAngle >= lightDirection.w)\n {\n     cosAngle = max(0., pow(cosAngle, lightData.w));\n       spotAtten = max(0., (cosAngle - lightDirection.w) / (1. - cosAngle));\n\n       // Diffuse\n        float ndl = max(0., dot(vNormal, -lightDirection.xyz));\n\n     // Specular\n       vec3 angleW = normalize(viewDirectionW - lightDirection.xyz);\n     float specComp = max(0., dot(vNormal, angleW));\n       specComp = pow(specComp, vSpecularColor.a);\n\n     result.diffuse = ndl * spotAtten * diffuseColor;\n      result.specular = specComp * specularColor * spotAtten;\n\n     return result;\n    }\n\n   result.diffuse = vec3(0.);\n    result.specular = vec3(0.);\n\n return result;\n}\n\nlightingInfo computeHemisphericLighting(vec3 viewDirectionW, vec3 vNormal, vec4 lightData, vec3 diffuseColor, vec3 specularColor, vec3 groundColor) {\n    lightingInfo result;\n\n    // Diffuse\n    float ndl = dot(vNormal, lightData.xyz) * 0.5 + 0.5;\n\n    // Specular\n   vec3 angleW = normalize(viewDirectionW + lightData.xyz);\n  float specComp = max(0., dot(vNormal, angleW));\n   specComp = pow(specComp, vSpecularColor.a);\n\n result.diffuse = mix(groundColor, diffuseColor, ndl);\n result.specular = specComp * specularColor;\n\n return result;\n}\n\nvoid main(void) {\n    // Clip plane\n#ifdef CLIPPLANE\n   if (fClipDistance > 0.0)\n      discard;\n#endif\n\n    vec3 viewDirectionW = normalize(vEyePosition - vPositionW);\n\n // Base color\n vec4 baseColor = vec4(1., 1., 1., 1.);\n    vec3 diffuseColor = vDiffuseColor.rgb;\n\n#ifdef VERTEXCOLOR\n  diffuseColor *= vColor;\n#endif\n\n#ifdef DIFFUSE\n baseColor = texture2D(diffuseSampler, vDiffuseUV);\n\n#ifdef ALPHATEST\n    if (baseColor.a < 0.4)\n        discard;\n#endif\n\n    baseColor.rgb *= vDiffuseInfos.y;\n#endif\n\n   // Bump\n   vec3 normalW = vNormalW;\n\n#ifdef BUMP\n   normalW = perturbNormal(viewDirectionW);\n#endif\n\n    // Ambient color\n  vec3 baseAmbientColor = vec3(1., 1., 1.);\n\n#ifdef AMBIENT\n   baseAmbientColor = texture2D(ambientSampler, vAmbientUV).rgb * vAmbientInfos.y;\n#endif\n\n // Lighting\n   vec3 diffuseBase = vec3(0., 0., 0.);\n  vec3 specularBase = vec3(0., 0., 0.);\n float shadow = 1.;\n\n#ifdef LIGHT0\n#ifdef SPOTLIGHT0\n    lightingInfo info = computeSpotLighting(viewDirectionW, normalW, vLightData0, vLightDirection0, vLightDiffuse0, vLightSpecular0);\n#endif\n#ifdef HEMILIGHT0\n  lightingInfo info = computeHemisphericLighting(viewDirectionW, normalW, vLightData0, vLightDiffuse0, vLightSpecular0, vLightGround0);\n#endif\n#ifdef POINTDIRLIGHT0\n  lightingInfo info = computeLighting(viewDirectionW, normalW, vLightData0, vLightDiffuse0, vLightSpecular0);\n#endif\n#ifdef SHADOW0\n#ifdef SHADOWVSM0\n    shadow = computeShadowWithVSM(vPositionFromLight0, shadowSampler0);\n#else\n    shadow = computeShadow(vPositionFromLight0, shadowSampler0);\n#endif\n#else\n   shadow = 1.;\n#endif\n  diffuseBase += info.diffuse * shadow;\n specularBase += info.specular * shadow;\n#endif\n\n#ifdef LIGHT1\n#ifdef SPOTLIGHT1\n   info = computeSpotLighting(viewDirectionW, normalW, vLightData1, vLightDirection1, vLightDiffuse1, vLightSpecular1);\n#endif\n#ifdef HEMILIGHT1\n   info = computeHemisphericLighting(viewDirectionW, normalW, vLightData1, vLightDiffuse1, vLightSpecular1, vLightGround1);\n#endif\n#ifdef POINTDIRLIGHT1\n   info = computeLighting(viewDirectionW, normalW, vLightData1, vLightDiffuse1, vLightSpecular1);\n#endif\n#ifdef SHADOW1\n#ifdef SHADOWVSM1\n shadow = computeShadowWithVSM(vPositionFromLight1, shadowSampler1);\n#else\n    shadow = computeShadow(vPositionFromLight1, shadowSampler1);\n#endif\n#else\n   shadow = 1.;\n#endif\n  diffuseBase += info.diffuse * shadow;\n specularBase += info.specular * shadow;\n#endif\n\n#ifdef LIGHT2\n#ifdef SPOTLIGHT2\n   info = computeSpotLighting(viewDirectionW, normalW, vLightData2, vLightDirection2, vLightDiffuse2, vLightSpecular2);\n#endif\n#ifdef HEMILIGHT2\n   info = computeHemisphericLighting(viewDirectionW, normalW, vLightData2, vLightDiffuse2, vLightSpecular2, vLightGround2);\n#endif\n#ifdef POINTDIRLIGHT2\n   info = computeLighting(viewDirectionW, normalW, vLightData2, vLightDiffuse2, vLightSpecular2);\n#endif\n#ifdef SHADOW2\n#ifdef SHADOWVSM2\n shadow = computeShadowWithVSM(vPositionFromLight2, shadowSampler2);\n#else\n    shadow = computeShadow(vPositionFromLight2, shadowSampler2);\n#endif    \n#else\n   shadow = 1.;\n#endif\n  diffuseBase += info.diffuse * shadow;\n specularBase += info.specular * shadow;\n#endif\n\n#ifdef LIGHT3\n#ifdef SPOTLIGHT3\n   info = computeSpotLighting(viewDirectionW, normalW, vLightData3, vLightDirection3, vLightDiffuse3, vLightSpecular3);\n#endif\n#ifdef HEMILIGHT3\n   info = computeHemisphericLighting(viewDirectionW, normalW, vLightData3, vLightDiffuse3, vLightSpecular3, vLightGround3);\n#endif\n#ifdef POINTDIRLIGHT3\n   info = computeLighting(viewDirectionW, normalW, vLightData3, vLightDiffuse3, vLightSpecular3);\n#endif\n#ifdef SHADOW3\n#ifdef SHADOWVSM3\n shadow = computeShadowWithVSM(vPositionFromLight3, shadowSampler3);\n#else\n    shadow = computeShadow(vPositionFromLight3, shadowSampler3);\n#endif    \n#else\n   shadow = 1.;\n#endif\n  diffuseBase += info.diffuse * shadow;\n specularBase += info.specular * shadow;\n#endif\n\n // Reflection\n vec3 reflectionColor = vec3(0., 0., 0.);\n\n#ifdef REFLECTION\n vec3 vReflectionUVW = computeReflectionCoords(vReflectionInfos.x, vec4(vPositionW, 1.0), normalW);\n\n  if (vReflectionInfos.z != 0.0)\n    {\n     reflectionColor = textureCube(reflectionCubeSampler, vReflectionUVW).rgb * vReflectionInfos.y;\n    }\n else\n  {\n     vec2 coords = vReflectionUVW.xy;\n\n        if (vReflectionInfos.x == MAP_PROJECTION)\n     {\n         coords /= vReflectionUVW.z;\n       }\n\n       coords.y = 1.0 - coords.y;\n\n      reflectionColor = texture2D(reflection2DSampler, coords).rgb * vReflectionInfos.y;\n    }\n#endif\n\n   // Alpha\n  float alpha = vDiffuseColor.a;\n\n#ifdef OPACITY\n  vec4 opacityMap = texture2D(opacitySampler, vOpacityUV);\n  opacityMap.rgb = opacityMap.rgb * vec3(0.3, 0.59, 0.11) * opacityMap.a;\n   alpha *= (opacityMap.x + opacityMap.y + opacityMap.z)* vOpacityInfos.y;\n#endif\n\n // Emissive\n   vec3 emissiveColor = vEmissiveColor;\n#ifdef EMISSIVE\n emissiveColor += texture2D(emissiveSampler, vEmissiveUV).rgb * vEmissiveInfos.y;\n#endif\n\n    // Specular map\n   vec3 specularColor = vSpecularColor.rgb;\n#ifdef SPECULAR\n specularColor = texture2D(specularSampler, vSpecularUV).rgb * vSpecularInfos.y;\n#endif\n\n // Composition\n    vec3 finalDiffuse = clamp(diffuseBase * diffuseColor + emissiveColor + vAmbientColor, 0.0, 1.0) * baseColor.rgb;\n  vec3 finalSpecular = specularBase * specularColor;\n\n  vec4 color = vec4(finalDiffuse * baseAmbientColor + finalSpecular + reflectionColor, alpha);\n\n#ifdef FOG\n    float fog = CalcFogFactor();\n  color.rgb = fog * color.rgb + (1.0 - fog) * vFogColor;\n#endif\n\n  gl_FragColor = color;\n}",
        defaultVertexShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Attributes\nattribute vec3 position;\nattribute vec3 normal;\n#ifdef UV1\nattribute vec2 uv;\n#endif\n#ifdef UV2\nattribute vec2 uv2;\n#endif\n#ifdef VERTEXCOLOR\nattribute vec3 color;\n#endif\n#ifdef BONES\nattribute vec4 matricesIndices;\nattribute vec4 matricesWeights;\n#endif\n\n// Uniforms\nuniform mat4 world;\nuniform mat4 view;\nuniform mat4 viewProjection;\n\n#ifdef DIFFUSE\nvarying vec2 vDiffuseUV;\nuniform mat4 diffuseMatrix;\nuniform vec2 vDiffuseInfos;\n#endif\n\n#ifdef AMBIENT\nvarying vec2 vAmbientUV;\nuniform mat4 ambientMatrix;\nuniform vec2 vAmbientInfos;\n#endif\n\n#ifdef OPACITY\nvarying vec2 vOpacityUV;\nuniform mat4 opacityMatrix;\nuniform vec2 vOpacityInfos;\n#endif\n\n#ifdef EMISSIVE\nvarying vec2 vEmissiveUV;\nuniform vec2 vEmissiveInfos;\nuniform mat4 emissiveMatrix;\n#endif\n\n#ifdef SPECULAR\nvarying vec2 vSpecularUV;\nuniform vec2 vSpecularInfos;\nuniform mat4 specularMatrix;\n#endif\n\n#ifdef BUMP\nvarying vec2 vBumpUV;\nuniform vec2 vBumpInfos;\nuniform mat4 bumpMatrix;\n#endif\n\n#ifdef BONES\nuniform mat4 mBones[BonesPerMesh];\n#endif\n\n// Output\nvarying vec3 vPositionW;\nvarying vec3 vNormalW;\n\n#ifdef VERTEXCOLOR\nvarying vec3 vColor;\n#endif\n\n#ifdef CLIPPLANE\nuniform vec4 vClipPlane;\nvarying float fClipDistance;\n#endif\n\n#ifdef FOG\nvarying float fFogDistance;\n#endif\n\n#ifdef SHADOWS\n#ifdef LIGHT0\nuniform mat4 lightMatrix0;\nvarying vec4 vPositionFromLight0;\n#endif\n#ifdef LIGHT1\nuniform mat4 lightMatrix1;\nvarying vec4 vPositionFromLight1;\n#endif\n#ifdef LIGHT2\nuniform mat4 lightMatrix2;\nvarying vec4 vPositionFromLight2;\n#endif\n#ifdef LIGHT3\nuniform mat4 lightMatrix3;\nvarying vec4 vPositionFromLight3;\n#endif\n#endif\n\n#ifdef REFLECTION\nvarying vec3 vPositionUVW;\n#endif\n\nvoid main(void) {\n   mat4 finalWorld;\n\n#ifdef REFLECTION\n vPositionUVW = position;\n#endif \n\n#ifdef BONES\n mat4 m0 = mBones[int(matricesIndices.x)] * matricesWeights.x;\n mat4 m1 = mBones[int(matricesIndices.y)] * matricesWeights.y;\n mat4 m2 = mBones[int(matricesIndices.z)] * matricesWeights.z;\n\n#ifdef BONES4\n    mat4 m3 = mBones[int(matricesIndices.w)] * matricesWeights.w;\n finalWorld = world * (m0 + m1 + m2 + m3);\n#else\n  finalWorld = world * (m0 + m1 + m2);\n#endif \n\n#else\n    finalWorld = world;\n#endif\n   gl_Position = viewProjection * finalWorld * vec4(position, 1.0);\n\n    vec4 worldPos = finalWorld * vec4(position, 1.0);\n vPositionW = vec3(worldPos);\n  vNormalW = normalize(vec3(finalWorld * vec4(normal, 0.0)));\n\n // Texture coordinates\n#ifndef UV1\n   vec2 uv = vec2(0., 0.);\n#endif\n#ifndef UV2\n  vec2 uv2 = vec2(0., 0.);\n#endif\n\n#ifdef DIFFUSE\n    if (vDiffuseInfos.x == 0.)\n    {\n     vDiffuseUV = vec2(diffuseMatrix * vec4(uv, 1.0, 0.0));\n    }\n else\n  {\n     vDiffuseUV = vec2(diffuseMatrix * vec4(uv2, 1.0, 0.0));\n   }\n#endif\n\n#ifdef AMBIENT\n   if (vAmbientInfos.x == 0.)\n    {\n     vAmbientUV = vec2(ambientMatrix * vec4(uv, 1.0, 0.0));\n    }\n else\n  {\n     vAmbientUV = vec2(ambientMatrix * vec4(uv2, 1.0, 0.0));\n   }\n#endif\n\n#ifdef OPACITY\n   if (vOpacityInfos.x == 0.)\n    {\n     vOpacityUV = vec2(opacityMatrix * vec4(uv, 1.0, 0.0));\n    }\n else\n  {\n     vOpacityUV = vec2(opacityMatrix * vec4(uv2, 1.0, 0.0));\n   }\n#endif\n\n#ifdef EMISSIVE\n  if (vEmissiveInfos.x == 0.)\n   {\n     vEmissiveUV = vec2(emissiveMatrix * vec4(uv, 1.0, 0.0));\n  }\n else\n  {\n     vEmissiveUV = vec2(emissiveMatrix * vec4(uv2, 1.0, 0.0));\n }\n#endif\n\n#ifdef SPECULAR\n  if (vSpecularInfos.x == 0.)\n   {\n     vSpecularUV = vec2(specularMatrix * vec4(uv, 1.0, 0.0));\n  }\n else\n  {\n     vSpecularUV = vec2(specularMatrix * vec4(uv2, 1.0, 0.0));\n }\n#endif\n\n#ifdef BUMP\n  if (vBumpInfos.x == 0.)\n   {\n     vBumpUV = vec2(bumpMatrix * vec4(uv, 1.0, 0.0));\n  }\n else\n  {\n     vBumpUV = vec2(bumpMatrix * vec4(uv2, 1.0, 0.0));\n }\n#endif\n\n   // Clip plane\n#ifdef CLIPPLANE\n   fClipDistance = dot(worldPos, vClipPlane);\n#endif\n\n  // Fog\n#ifdef FOG\n    fFogDistance = (view * worldPos).z;\n#endif\n\n // Shadows\n#ifdef SHADOWS\n#ifdef LIGHT0\n vPositionFromLight0 = lightMatrix0 * vec4(position, 1.0);\n#endif\n#ifdef LIGHT1\n  vPositionFromLight1 = lightMatrix1 * vec4(position, 1.0);\n#endif\n#ifdef LIGHT2\n  vPositionFromLight2 = lightMatrix2 * vec4(position, 1.0);\n#endif\n#ifdef LIGHT3\n  vPositionFromLight3 = lightMatrix3 * vec4(position, 1.0);\n#endif\n#endif\n\n   // Vertex color\n#ifdef VERTEXCOLOR\n   vColor = color;\n#endif\n}",
        filterPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Samplers\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\n\nuniform mat4 kernelMatrix;\n\nvoid main(void)\n{\n   vec3 baseColor = texture2D(textureSampler, vUV).rgb;\n  vec3 updatedColor = (kernelMatrix * vec4(baseColor, 1.0)).rgb;\n\n  gl_FragColor = vec4(updatedColor, 1.0);\n}",
        fxaaPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n#define FXAA_REDUCE_MIN   (1.0/128.0)\n#define FXAA_REDUCE_MUL   (1.0/8.0)\n#define FXAA_SPAN_MAX     8.0\n\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\nuniform vec2 texelSize;\n\nvoid main(){\n    vec2 localTexelSize = texelSize;\n  vec3 rgbNW = texture2D(textureSampler, (vUV + vec2(-1.0, -1.0) * localTexelSize)).xyz;\n    vec3 rgbNE = texture2D(textureSampler, (vUV + vec2(1.0, -1.0) * localTexelSize)).xyz;\n vec3 rgbSW = texture2D(textureSampler, (vUV + vec2(-1.0, 1.0) * localTexelSize)).xyz;\n vec3 rgbSE = texture2D(textureSampler, (vUV + vec2(1.0, 1.0) * localTexelSize)).xyz;\n  vec3 rgbM = texture2D(textureSampler, vUV ).xyz;\n  vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n  float lumaNE = dot(rgbNE, luma);\n  float lumaSW = dot(rgbSW, luma);\n  float lumaSE = dot(rgbSE, luma);\n  float lumaM = dot(rgbM, luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n  vec2 dir = vec2(-((lumaNW + lumaNE) - (lumaSW + lumaSE)), ((lumaNW + lumaSW) - (lumaNE + lumaSE)));\n\n float dirReduce = max(\n        (lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL),\n       FXAA_REDUCE_MIN);\n\n   float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n     max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n     dir * rcpDirMin)) * localTexelSize;\n\n vec3 rgbA = 0.5 * (\n       texture2D(textureSampler, vUV + dir * (1.0 / 3.0 - 0.5)).xyz +\n        texture2D(textureSampler, vUV + dir * (2.0 / 3.0 - 0.5)).xyz);\n\n  vec3 rgbB = rgbA * 0.5 + 0.25 * (\n     texture2D(textureSampler, vUV + dir *  -0.5).xyz +\n        texture2D(textureSampler, vUV + dir * 0.5).xyz);\n  float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax)) {\n     gl_FragColor = vec4(rgbA, 1.0);\n   }\n else {\n        gl_FragColor = vec4(rgbB, 1.0);\n   }\n}",
        layerPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Samplers\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\n\n// Color\nuniform vec4 color;\n\nvoid main(void) {\n  vec4 baseColor = texture2D(textureSampler, vUV);\n\n    gl_FragColor = baseColor * color;\n}",
        layerVertexShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Attributes\nattribute vec2 position;\n\n// Uniforms\nuniform mat4 textureMatrix;\n\n// Output\nvarying vec2 vUV;\n\nconst vec2 madd = vec2(0.5, 0.5);\n\nvoid main(void) { \n\n    vUV = vec2(textureMatrix * vec4(position * madd + madd, 1.0, 0.0));\n   gl_Position = vec4(position, 0.0, 1.0);\n}",
        legacydefaultPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n#define MAP_PROJECTION 4.\n\n// Constants\nuniform vec3 vEyePosition;\nuniform vec3 vAmbientColor;\nuniform vec4 vDiffuseColor;\nuniform vec4 vSpecularColor;\nuniform vec3 vEmissiveColor;\n\n// Input\nvarying vec3 vPositionW;\nvarying vec3 vNormalW;\n\n#ifdef VERTEXCOLOR\nvarying vec3 vColor;\n#endif\n\n// Lights\n#ifdef LIGHT0\nuniform vec4 vLightData0;\nuniform vec3 vLightDiffuse0;\nuniform vec3 vLightSpecular0;\n#ifdef SHADOW0\nvarying vec4 vPositionFromLight0;\nuniform sampler2D shadowSampler0;\n#endif\n#ifdef SPOTLIGHT0\nuniform vec4 vLightDirection0;\n#endif\n#ifdef HEMILIGHT0\nuniform vec3 vLightGround0;\n#endif\n#endif\n\n#ifdef LIGHT1\nuniform vec4 vLightData1;\nuniform vec3 vLightDiffuse1;\nuniform vec3 vLightSpecular1;\n#ifdef SHADOW1\nvarying vec4 vPositionFromLight1;\nuniform sampler2D shadowSampler1;\n#endif\n#ifdef SPOTLIGHT1\nuniform vec4 vLightDirection1;\n#endif\n#ifdef HEMILIGHT1\nuniform vec3 vLightGround1;\n#endif\n#endif\n\n#ifdef LIGHT2\nuniform vec4 vLightData2;\nuniform vec3 vLightDiffuse2;\nuniform vec3 vLightSpecular2;\n#ifdef SHADOW2\nvarying vec4 vPositionFromLight2;\nuniform sampler2D shadowSampler2;\n#endif\n#ifdef SPOTLIGHT2\nuniform vec4 vLightDirection2;\n#endif\n#ifdef HEMILIGHT2\nuniform vec3 vLightGround2;\n#endif\n#endif\n\n#ifdef LIGHT3\nuniform vec4 vLightData3;\nuniform vec3 vLightDiffuse3;\nuniform vec3 vLightSpecular3;\n#ifdef SHADOW3\nvarying vec4 vPositionFromLight3;\nuniform sampler2D shadowSampler3;\n#endif\n#ifdef SPOTLIGHT3\nuniform vec4 vLightDirection3;\n#endif\n#ifdef HEMILIGHT3\nuniform vec3 vLightGround3;\n#endif\n#endif\n\n// Samplers\n#ifdef DIFFUSE\nvarying vec2 vDiffuseUV;\nuniform sampler2D diffuseSampler;\nuniform vec2 vDiffuseInfos;\n#endif\n\n#ifdef AMBIENT\nvarying vec2 vAmbientUV;\nuniform sampler2D ambientSampler;\nuniform vec2 vAmbientInfos;\n#endif\n\n#ifdef OPACITY    \nvarying vec2 vOpacityUV;\nuniform sampler2D opacitySampler;\nuniform vec2 vOpacityInfos;\n#endif\n\n#ifdef REFLECTION\nvarying vec3 vReflectionUVW;\nuniform samplerCube reflectionCubeSampler;\nuniform sampler2D reflection2DSampler;\nuniform vec3 vReflectionInfos;\n#endif\n\n#ifdef EMISSIVE\nvarying vec2 vEmissiveUV;\nuniform vec2 vEmissiveInfos;\nuniform sampler2D emissiveSampler;\n#endif\n\n#ifdef SPECULAR\nvarying vec2 vSpecularUV;\nuniform vec2 vSpecularInfos;\nuniform sampler2D specularSampler;\n#endif\n\n// Shadows\n#ifdef SHADOWS\n\nfloat unpack(vec4 color)\n{\n    const vec4 bitShift = vec4(1. / (255. * 255. * 255.), 1. / (255. * 255.), 1. / 255., 1.);\n return dot(color, bitShift);\n}\n\nfloat unpackHalf(vec2 color)\n{\n    return color.x + (color.y / 255.0);\n}\n\nfloat computeShadow(vec4 vPositionFromLight, sampler2D shadowSampler)\n{\n    vec3 depth = vPositionFromLight.xyz / vPositionFromLight.w;\n   vec2 uv = 0.5 * depth.xy + vec2(0.5, 0.5);\n\n  if (uv.x < 0. || uv.x > 1.0 || uv.y < 0. || uv.y > 1.0)\n   {\n     return 1.0;\n   }\n\n   float shadow = unpack(texture2D(shadowSampler, uv));\n\n    if (depth.z > shadow)\n {\n     return 0.;\n    }\n return 1.;\n}\n\n// Thanks to http://devmaster.net/\nfloat ChebychevInequality(vec2 moments, float t)\n{\n  if (t <= moments.x)\n   {\n     return 1.0;\n   }\n\n   float variance = moments.y - (moments.x * moments.x);\n variance = max(variance, 0.);\n\n   float d = t - moments.x;\n  return variance / (variance + d * d);\n}\n\nfloat computeShadowWithVSM(vec4 vPositionFromLight, sampler2D shadowSampler)\n{\n   vec3 depth = vPositionFromLight.xyz / vPositionFromLight.w;\n   vec2 uv = 0.5 * depth.xy + vec2(0.5, 0.5);\n\n  if (uv.x < 0. || uv.x > 1.0 || uv.y < 0. || uv.y > 1.0)\n   {\n     return 1.0;\n   }\n\n   vec4 texel = texture2D(shadowSampler, uv);\n\n  vec2 moments = vec2(unpackHalf(texel.xy), unpackHalf(texel.zw));\n  return clamp(1.3 - ChebychevInequality(moments, depth.z), 0., 1.0);\n}\n#endif\n\n#ifdef CLIPPLANE\nvarying float fClipDistance;\n#endif\n\n// Fog\n#ifdef FOG\n\n#define FOGMODE_NONE    0.\n#define FOGMODE_EXP     1.\n#define FOGMODE_EXP2    2.\n#define FOGMODE_LINEAR  3.\n#define E 2.71828\n\nuniform vec4 vFogInfos;\nuniform vec3 vFogColor;\nvarying float fFogDistance;\n\nfloat CalcFogFactor()\n{\n  float fogCoeff = 1.0;\n float fogStart = vFogInfos.y;\n float fogEnd = vFogInfos.z;\n   float fogDensity = vFogInfos.w;\n\n if (FOGMODE_LINEAR == vFogInfos.x)\n    {\n     fogCoeff = (fogEnd - fFogDistance) / (fogEnd - fogStart);\n }\n else if (FOGMODE_EXP == vFogInfos.x)\n  {\n     fogCoeff = 1.0 / pow(E, fFogDistance * fogDensity);\n   }\n else if (FOGMODE_EXP2 == vFogInfos.x)\n {\n     fogCoeff = 1.0 / pow(E, fFogDistance * fFogDistance * fogDensity * fogDensity);\n   }\n\n   return clamp(fogCoeff, 0.0, 1.0);\n}\n#endif\n\n// Light Computing\nmat3 computeLighting(vec3 viewDirectionW, vec3 vNormal, vec4 lightData, vec3 diffuseColor, vec3 specularColor) {\n  mat3 result;\n\n    vec3 lightVectorW;\n    if (lightData.w == 0.)\n    {\n     lightVectorW = normalize(lightData.xyz - vPositionW);\n }\n else\n  {\n     lightVectorW = normalize(-lightData.xyz);\n }\n\n   // diffuse\n    float ndl = max(0., dot(vNormal, lightVectorW));\n\n    // Specular\n   vec3 angleW = normalize(viewDirectionW + lightVectorW);\n   float specComp = max(0., dot(vNormal, angleW));\n   specComp = max(0., pow(specComp, max(1.0, vSpecularColor.a)));\n\n  result[0] = ndl * diffuseColor;\n   result[1] = specComp * specularColor;\n result[2] = vec3(0.);\n\n   return result;\n}\n\nmat3 computeSpotLighting(vec3 viewDirectionW, vec3 vNormal, vec4 lightData, vec4 lightDirection, vec3 diffuseColor, vec3 specularColor) {\n    mat3 result;\n\n    vec3 lightVectorW = normalize(lightData.xyz - vPositionW);\n\n  // diffuse\n    float cosAngle = max(0., dot(-lightDirection.xyz, lightVectorW));\n float spotAtten = 0.0;\n\n  if (cosAngle >= lightDirection.w)\n {\n     cosAngle = max(0., pow(cosAngle, lightData.w));\n       spotAtten = max(0., (cosAngle - lightDirection.w) / (1. - cosAngle));\n\n       // Diffuse\n        float ndl = max(0., dot(vNormal, -lightDirection.xyz));\n\n     // Specular\n       vec3 angleW = normalize(viewDirectionW - lightDirection.xyz);\n     float specComp = max(0., dot(vNormal, angleW));\n       specComp = pow(specComp, vSpecularColor.a);\n\n     result[0] = ndl * spotAtten * diffuseColor;\n       result[1] = specComp * specularColor * spotAtten;\n     result[2] = vec3(0.);\n\n       return result;\n    }\n\n   result[0] = vec3(0.);\n result[1] = vec3(0.);\n result[2] = vec3(0.);\n\n   return result;\n}\n\nmat3 computeHemisphericLighting(vec3 viewDirectionW, vec3 vNormal, vec4 lightData, vec3 diffuseColor, vec3 specularColor, vec3 groundColor) {\n    mat3 result;\n\n    // Diffuse\n    float ndl = dot(vNormal, lightData.xyz) * 0.5 + 0.5;\n\n    // Specular\n   vec3 angleW = normalize(viewDirectionW + lightData.xyz);\n  float specComp = max(0., dot(vNormal, angleW));\n   specComp = pow(specComp, vSpecularColor.a);\n\n result[0] = mix(groundColor, diffuseColor, ndl);\n  result[1] = specComp * specularColor;\n result[2] = vec3(0.);\n\n   return result;\n}\n\nvoid main(void) {\n    // Clip plane\n#ifdef CLIPPLANE\n   if (fClipDistance > 0.0)\n      discard;\n#endif\n\n    vec3 viewDirectionW = normalize(vEyePosition - vPositionW);\n\n // Base color\n vec4 baseColor = vec4(1., 1., 1., 1.);\n    vec3 diffuseColor = vDiffuseColor.rgb;\n\n#ifdef VERTEXCOLOR\n  diffuseColor *= vColor;\n#endif\n\n#ifdef DIFFUSE\n baseColor = texture2D(diffuseSampler, vDiffuseUV);\n\n#ifdef ALPHATEST\n    if (baseColor.a < 0.4)\n        discard;\n#endif\n\n    baseColor.rgb *= vDiffuseInfos.y;\n#endif\n\n   // Bump\n   vec3 normalW = vNormalW;\n\n    // Ambient color\n  vec3 baseAmbientColor = vec3(1., 1., 1.);\n\n#ifdef AMBIENT\n   baseAmbientColor = texture2D(ambientSampler, vAmbientUV).rgb * vAmbientInfos.y;\n#endif\n\n // Lighting\n   vec3 diffuseBase = vec3(0., 0., 0.);\n  vec3 specularBase = vec3(0., 0., 0.);\n float shadow = 1.;\n\n#ifdef LIGHT0\n#ifdef SPOTLIGHT0\n    mat3 info = computeSpotLighting(viewDirectionW, normalW, vLightData0, vLightDirection0, vLightDiffuse0, vLightSpecular0);\n#endif\n#ifdef HEMILIGHT0\n  mat3 info = computeHemisphericLighting(viewDirectionW, normalW, vLightData0, vLightDiffuse0, vLightSpecular0, vLightGround0);\n#endif\n#ifdef POINTDIRLIGHT0\n  mat3 info = computeLighting(viewDirectionW, normalW, vLightData0, vLightDiffuse0, vLightSpecular0);\n#endif\n#ifdef SHADOW0\n#ifdef SHADOWVSM0\n    shadow = computeShadowWithVSM(vPositionFromLight0, shadowSampler0);\n#else\n    shadow = computeShadow(vPositionFromLight0, shadowSampler0);\n#endif\n#else\n   shadow = 1.;\n#endif\n  diffuseBase += info[0] * shadow;\n  specularBase += info[1] * shadow;\n#endif\n\n#ifdef LIGHT1\n#ifdef SPOTLIGHT1\n info = computeSpotLighting(viewDirectionW, normalW, vLightData1, vLightDirection1, vLightDiffuse1, vLightSpecular1);\n#endif\n#ifdef HEMILIGHT1\n   info = computeHemisphericLighting(viewDirectionW, normalW, vLightData1, vLightDiffuse1, vLightSpecular1, vLightGround1);\n#endif\n#ifdef POINTDIRLIGHT1\n   info = computeLighting(viewDirectionW, normalW, vLightData1, vLightDiffuse1, vLightSpecular1);\n#endif\n#ifdef SHADOW1\n#ifdef SHADOWVSM1\n shadow = computeShadowWithVSM(vPositionFromLight1, shadowSampler1);\n#else\n    shadow = computeShadow(vPositionFromLight1, shadowSampler1);\n#endif\n#else\n   shadow = 1.;\n#endif\n  diffuseBase += info[0] * shadow;\n  specularBase += info[1] * shadow;\n#endif\n\n#ifdef LIGHT2\n#ifdef SPOTLIGHT2\n info = computeSpotLighting(viewDirectionW, normalW, vLightData2, vLightDirection2, vLightDiffuse2, vLightSpecular2);\n#endif\n#ifdef HEMILIGHT2\n   info = computeHemisphericLighting(viewDirectionW, normalW, vLightData2, vLightDiffuse2, vLightSpecular2, vLightGround2);\n#endif\n#ifdef POINTDIRLIGHT2\n   info = computeLighting(viewDirectionW, normalW, vLightData2, vLightDiffuse2, vLightSpecular2);\n#endif\n#ifdef SHADOW2\n#ifdef SHADOWVSM2\n shadow = computeShadowWithVSM(vPositionFromLight2, shadowSampler2);\n#else\n    shadow = computeShadow(vPositionFromLight2, shadowSampler2);\n#endif    \n#else\n   shadow = 1.;\n#endif\n  diffuseBase += info[0] * shadow;\n  specularBase += info[1] * shadow;\n#endif\n\n#ifdef LIGHT3\n#ifdef SPOTLIGHT3\n info = computeSpotLighting(viewDirectionW, normalW, vLightData3, vLightDirection3, vLightDiffuse3, vLightSpecular3);\n#endif\n#ifdef HEMILIGHT3\n   info = computeHemisphericLighting(viewDirectionW, normalW, vLightData3, vLightDiffuse3, vLightSpecular3, vLightGround3);\n#endif\n#ifdef POINTDIRLIGHT3\n   info = computeLighting(viewDirectionW, normalW, vLightData3, vLightDiffuse3, vLightSpecular3);\n#endif\n#ifdef SHADOW3\n#ifdef SHADOWVSM3\n shadow = computeShadowWithVSM(vPositionFromLight3, shadowSampler3);\n#else\n    shadow = computeShadow(vPositionFromLight3, shadowSampler3);\n#endif    \n#else\n   shadow = 1.;\n#endif\n  diffuseBase += info[0] * shadow;\n  specularBase += info[1] * shadow;\n#endif\n\n   // Reflection\n vec3 reflectionColor = vec3(0., 0., 0.);\n\n#ifdef REFLECTION\n if (vReflectionInfos.z != 0.0)\n    {\n     reflectionColor = textureCube(reflectionCubeSampler, vReflectionUVW).rgb * vReflectionInfos.y;\n    }\n else\n  {\n     vec2 coords = vReflectionUVW.xy;\n\n        if (vReflectionInfos.x == MAP_PROJECTION)\n     {\n         coords /= vReflectionUVW.z;\n       }\n\n       coords.y = 1.0 - coords.y;\n\n      reflectionColor = texture2D(reflection2DSampler, coords).rgb * vReflectionInfos.y;\n    }\n#endif\n\n   // Alpha\n  float alpha = vDiffuseColor.a;\n\n#ifdef OPACITY\n  vec4 opacityMap = texture2D(opacitySampler, vOpacityUV);\n  opacityMap.rgb = opacityMap.rgb * vec3(0.3, 0.59, 0.11) * opacityMap.a;\n   alpha *= (opacityMap.x + opacityMap.y + opacityMap.z)* vOpacityInfos.y;\n#endif\n\n // Emissive\n   vec3 emissiveColor = vEmissiveColor;\n#ifdef EMISSIVE\n emissiveColor += texture2D(emissiveSampler, vEmissiveUV).rgb * vEmissiveInfos.y;\n#endif\n\n    // Specular map\n   vec3 specularColor = vSpecularColor.rgb;\n#ifdef SPECULAR\n specularColor = texture2D(specularSampler, vSpecularUV).rgb * vSpecularInfos.y;\n#endif\n\n // Composition\n    vec3 finalDiffuse = clamp(diffuseBase * diffuseColor + emissiveColor + vAmbientColor, 0.0, 1.0) * baseColor.rgb;\n  vec3 finalSpecular = specularBase * specularColor;\n\n  vec4 color = vec4(finalDiffuse * baseAmbientColor + finalSpecular + reflectionColor, alpha);\n\n#ifdef FOG\n    float fog = CalcFogFactor();\n  color.rgb = fog * color.rgb + (1.0 - fog) * vFogColor;\n#endif\n\n  gl_FragColor = color;\n}",
        legacydefaultVertexShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n#define MAP_EXPLICIT  0.\n#define MAP_SPHERICAL   1.\n#define MAP_PLANAR      2.\n#define MAP_CUBIC       3.\n#define MAP_PROJECTION  4.\n#define MAP_SKYBOX      5.\n\n// Attributes\nattribute vec3 position;\nattribute vec3 normal;\n#ifdef UV1\nattribute vec2 uv;\n#endif\n#ifdef UV2\nattribute vec2 uv2;\n#endif\n#ifdef VERTEXCOLOR\nattribute vec3 color;\n#endif\n#ifdef BONES\nattribute vec4 matricesIndices;\nattribute vec4 matricesWeights;\n#endif\n\n// Uniforms\nuniform mat4 world;\nuniform mat4 view;\nuniform mat4 viewProjection;\n\n#ifdef DIFFUSE\nvarying vec2 vDiffuseUV;\nuniform mat4 diffuseMatrix;\nuniform vec2 vDiffuseInfos;\n#endif\n\n#ifdef AMBIENT\nvarying vec2 vAmbientUV;\nuniform mat4 ambientMatrix;\nuniform vec2 vAmbientInfos;\n#endif\n\n#ifdef OPACITY\nvarying vec2 vOpacityUV;\nuniform mat4 opacityMatrix;\nuniform vec2 vOpacityInfos;\n#endif\n\n#ifdef REFLECTION\nuniform vec3 vEyePosition;\nvarying vec3 vReflectionUVW;\nuniform vec3 vReflectionInfos;\nuniform mat4 reflectionMatrix;\n#endif\n\n#ifdef EMISSIVE\nvarying vec2 vEmissiveUV;\nuniform vec2 vEmissiveInfos;\nuniform mat4 emissiveMatrix;\n#endif\n\n#ifdef SPECULAR\nvarying vec2 vSpecularUV;\nuniform vec2 vSpecularInfos;\nuniform mat4 specularMatrix;\n#endif\n\n#ifdef BUMP\nvarying vec2 vBumpUV;\nuniform vec2 vBumpInfos;\nuniform mat4 bumpMatrix;\n#endif\n\n#ifdef BONES\nuniform mat4 mBones[BonesPerMesh];\n#endif\n\n// Output\nvarying vec3 vPositionW;\nvarying vec3 vNormalW;\n\n#ifdef VERTEXCOLOR\nvarying vec3 vColor;\n#endif\n\n#ifdef CLIPPLANE\nuniform vec4 vClipPlane;\nvarying float fClipDistance;\n#endif\n\n#ifdef FOG\nvarying float fFogDistance;\n#endif\n\n#ifdef SHADOWS\n#ifdef LIGHT0\nuniform mat4 lightMatrix0;\nvarying vec4 vPositionFromLight0;\n#endif\n#ifdef LIGHT1\nuniform mat4 lightMatrix1;\nvarying vec4 vPositionFromLight1;\n#endif\n#ifdef LIGHT2\nuniform mat4 lightMatrix2;\nvarying vec4 vPositionFromLight2;\n#endif\n#ifdef LIGHT3\nuniform mat4 lightMatrix3;\nvarying vec4 vPositionFromLight3;\n#endif\n#endif\n\n#ifdef REFLECTION\nvec3 computeReflectionCoords(float mode, vec4 worldPos, vec3 worldNormal)\n{\n if (mode == MAP_SPHERICAL)\n    {\n     vec3 coords = vec3(view * vec4(worldNormal, 0.0));\n\n      return vec3(reflectionMatrix * vec4(coords, 1.0));\n    }\n else if (mode == MAP_PLANAR)\n  {\n     vec3 viewDir = worldPos.xyz - vEyePosition;\n       vec3 coords = normalize(reflect(viewDir, worldNormal));\n\n     return vec3(reflectionMatrix * vec4(coords, 1));\n  }\n else if (mode == MAP_CUBIC)\n   {\n     vec3 viewDir = worldPos.xyz - vEyePosition;\n       vec3 coords = reflect(viewDir, worldNormal);\n\n        return vec3(reflectionMatrix * vec4(coords, 0));\n  }\n else if (mode == MAP_PROJECTION)\n  {\n     return vec3(reflectionMatrix * (view * worldPos));\n    }\n else if (mode == MAP_SKYBOX)\n  {\n     return position;\n  }\n\n   return vec3(0, 0, 0);\n}\n#endif\n\nvoid main(void) {\n mat4 finalWorld;\n\n#ifdef BONES\n  mat4 m0 = mBones[int(matricesIndices.x)] * matricesWeights.x;\n mat4 m1 = mBones[int(matricesIndices.y)] * matricesWeights.y;\n mat4 m2 = mBones[int(matricesIndices.z)] * matricesWeights.z;\n\n#ifdef BONES4\n    mat4 m3 = mBones[int(matricesIndices.w)] * matricesWeights.w;\n finalWorld = world * (m0 + m1 + m2 + m3);\n#else\n  finalWorld = world * (m0 + m1 + m2);\n#endif \n\n#else\n    finalWorld = world;\n#endif\n\n gl_Position = viewProjection * finalWorld * vec4(position, 1.0);\n\n    vec4 worldPos = finalWorld * vec4(position, 1.0);\n vPositionW = vec3(worldPos);\n  vNormalW = normalize(vec3(finalWorld * vec4(normal, 0.0)));\n\n // Texture coordinates\n#ifndef UV1\n   vec2 uv = vec2(0., 0.);\n#endif\n#ifndef UV2\n  vec2 uv2 = vec2(0., 0.);\n#endif\n\n#ifdef DIFFUSE\n    if (vDiffuseInfos.x == 0.)\n    {\n     vDiffuseUV = vec2(diffuseMatrix * vec4(uv, 1.0, 0.0));\n    }\n else\n  {\n     vDiffuseUV = vec2(diffuseMatrix * vec4(uv2, 1.0, 0.0));\n   }\n#endif\n\n#ifdef AMBIENT\n   if (vAmbientInfos.x == 0.)\n    {\n     vAmbientUV = vec2(ambientMatrix * vec4(uv, 1.0, 0.0));\n    }\n else\n  {\n     vAmbientUV = vec2(ambientMatrix * vec4(uv2, 1.0, 0.0));\n   }\n#endif\n\n#ifdef OPACITY\n   if (vOpacityInfos.x == 0.)\n    {\n     vOpacityUV = vec2(opacityMatrix * vec4(uv, 1.0, 0.0));\n    }\n else\n  {\n     vOpacityUV = vec2(opacityMatrix * vec4(uv2, 1.0, 0.0));\n   }\n#endif\n\n#ifdef REFLECTION\n    vReflectionUVW = computeReflectionCoords(vReflectionInfos.x, vec4(vPositionW, 1.0), vNormalW);\n#endif\n\n#ifdef EMISSIVE\n if (vEmissiveInfos.x == 0.)\n   {\n     vEmissiveUV = vec2(emissiveMatrix * vec4(uv, 1.0, 0.0));\n  }\n else\n  {\n     vEmissiveUV = vec2(emissiveMatrix * vec4(uv2, 1.0, 0.0));\n }\n#endif\n\n#ifdef SPECULAR\n  if (vSpecularInfos.x == 0.)\n   {\n     vSpecularUV = vec2(specularMatrix * vec4(uv, 1.0, 0.0));\n  }\n else\n  {\n     vSpecularUV = vec2(specularMatrix * vec4(uv2, 1.0, 0.0));\n }\n#endif\n\n#ifdef BUMP\n  if (vBumpInfos.x == 0.)\n   {\n     vBumpUV = vec2(bumpMatrix * vec4(uv, 1.0, 0.0));\n  }\n else\n  {\n     vBumpUV = vec2(bumpMatrix * vec4(uv2, 1.0, 0.0));\n }\n#endif\n\n   // Clip plane\n#ifdef CLIPPLANE\n   fClipDistance = dot(worldPos, vClipPlane);\n#endif\n\n  // Fog\n#ifdef FOG\n    fFogDistance = (view * worldPos).z;\n#endif\n\n // Shadows\n#ifdef SHADOWS\n#ifdef LIGHT0\n vPositionFromLight0 = lightMatrix0 * vec4(position, 1.0);\n#endif\n#ifdef LIGHT1\n  vPositionFromLight1 = lightMatrix1 * vec4(position, 1.0);\n#endif\n#ifdef LIGHT2\n  vPositionFromLight2 = lightMatrix2 * vec4(position, 1.0);\n#endif\n#ifdef LIGHT3\n  vPositionFromLight3 = lightMatrix3 * vec4(position, 1.0);\n#endif\n#endif\n\n   // Vertex color\n#ifdef VERTEXCOLOR\n   vColor = color;\n#endif\n}",
        lensFlarePixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Samplers\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\n\n// Color\nuniform vec4 color;\n\nvoid main(void) {\n  vec4 baseColor = texture2D(textureSampler, vUV);\n\n    gl_FragColor = baseColor * color;\n}",
        lensFlareVertexShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Attributes\nattribute vec2 position;\n\n// Uniforms\nuniform mat4 viewportMatrix;\n\n// Output\nvarying vec2 vUV;\n\nconst vec2 madd = vec2(0.5, 0.5);\n\nvoid main(void) {    \n\n    vUV = position * madd + madd;\n gl_Position = viewportMatrix * vec4(position, 0.0, 1.0);\n}",
        oculusDistortionCorrectionPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Samplers\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\nuniform vec2 LensCenter;\nuniform vec2 Scale;\nuniform vec2 ScaleIn;\nuniform vec4 HmdWarpParam;\n\nvec2 HmdWarp(vec2 in01) {\n\n  vec2 theta = (in01 - LensCenter) * ScaleIn; // Scales to [-1, 1]\n  float rSq = theta.x * theta.x + theta.y * theta.y;\n    vec2 rvector = theta * (HmdWarpParam.x + HmdWarpParam.y * rSq + HmdWarpParam.z * rSq * rSq + HmdWarpParam.w * rSq * rSq * rSq);\n   return LensCenter + Scale * rvector;\n}\n\n\n\nvoid main(void)\n{\n vec2 tc = HmdWarp(vUV);\n   if (tc.x <0.0 || tc.x>1.0 || tc.y<0.0 || tc.y>1.0)\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n  else{\n     gl_FragColor = vec4(texture2D(textureSampler, tc).rgb, 1.0);\n  }\n}",
        particlesPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Samplers\nvarying vec2 vUV;\nvarying vec4 vColor;\nuniform vec4 textureMask;\nuniform sampler2D diffuseSampler;\n\n#ifdef CLIPPLANE\nvarying float fClipDistance;\n#endif\n\nvoid main(void) {\n#ifdef CLIPPLANE\n  if (fClipDistance > 0.0)\n      discard;\n#endif\n  vec4 baseColor = texture2D(diffuseSampler, vUV);\n\n    gl_FragColor = (baseColor * textureMask + (vec4(1., 1., 1., 1.) - textureMask)) * vColor;\n}",
        particlesVertexShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Attributes\nattribute vec3 position;\nattribute vec4 color;\nattribute vec4 options;\n\n// Uniforms\nuniform mat4 view;\nuniform mat4 projection;\n\n// Output\nvarying vec2 vUV;\nvarying vec4 vColor;\n\n#ifdef CLIPPLANE\nuniform vec4 vClipPlane;\nuniform mat4 invView;\nvarying float fClipDistance;\n#endif\n\nvoid main(void) {    \n  vec3 viewPos = (view * vec4(position, 1.0)).xyz; \n vec3 cornerPos;\n   float size = options.y;\n   float angle = options.x;\n  vec2 offset = options.zw;\n\n   cornerPos = vec3(offset.x - 0.5, offset.y  - 0.5, 0.) * size;\n\n   // Rotate\n vec3 rotatedCorner;\n   rotatedCorner.x = cornerPos.x * cos(angle) - cornerPos.y * sin(angle);\n    rotatedCorner.y = cornerPos.x * sin(angle) + cornerPos.y * cos(angle);\n    rotatedCorner.z = 0.;\n\n   // Position\n   viewPos += rotatedCorner;\n gl_Position = projection * vec4(viewPos, 1.0);   \n \n  vColor = color;\n   vUV = offset;\n\n   // Clip plane\n#ifdef CLIPPLANE\n   vec4 worldPos = invView * vec4(viewPos, 1.0);\n fClipDistance = dot(worldPos, vClipPlane);\n#endif\n}",
        passPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Samplers\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\n\nvoid main(void) \n{\n  gl_FragColor = texture2D(textureSampler, vUV);\n}",
        postprocessVertexShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Attributes\nattribute vec2 position;\n\n// Output\nvarying vec2 vUV;\n\nconst vec2 madd = vec2(0.5, 0.5);\n\nvoid main(void) {   \n\n    vUV = position * madd + madd;\n gl_Position = vec4(position, 0.0, 1.0);\n}",
        refractionPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Samplers\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\nuniform sampler2D refractionSampler;\n\n// Parameters\nuniform vec3 baseColor;\nuniform float depth;\nuniform float colorLevel;\n\nvoid main() {\n float ref = 1.0 - texture2D(refractionSampler, vUV).r;\n\n  vec2 uv = vUV - vec2(0.5);\n    vec2 offset = uv * depth * ref;\n   vec3 sourceColor = texture2D(textureSampler, vUV - offset).rgb;\n\n gl_FragColor = vec4(sourceColor + sourceColor * ref * colorLevel, 1.0);\n}",
        shadowMapPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\nvec4 pack(float depth)\n{\n    const vec4 bitOffset = vec4(255. * 255. * 255., 255. * 255., 255., 1.);\n   const vec4 bitMask = vec4(0., 1. / 255., 1. / 255., 1. / 255.);\n   \n  vec4 comp = mod(depth * bitOffset * vec4(254.), vec4(255.)) / vec4(254.);\n comp -= comp.xxyz * bitMask;\n  \n  return comp;\n}\n\n// Thanks to http://devmaster.net/\nvec2 packHalf(float depth) \n{ \n    const vec2 bitOffset = vec2(1.0 / 255., 0.);\n  vec2 color = vec2(depth, fract(depth * 255.));\n\n  return color - (color.yy * bitOffset);\n}\n\n#ifndef VSM\nvarying vec4 vPosition;\n#endif\n\nvoid main(void)\n{\n#ifdef VSM\n   float moment1 = gl_FragCoord.z / gl_FragCoord.w;\n  float moment2 = moment1 * moment1;\n    gl_FragColor = vec4(packHalf(moment1), packHalf(moment2));\n#else\n gl_FragColor = pack(vPosition.z / vPosition.w);\n#endif\n}",
        shadowMapVertexShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Attribute\nattribute vec3 position;\n#ifdef BONES\nattribute vec4 matricesIndices;\nattribute vec4 matricesWeights;\n#endif\n\n// Uniform\n#ifdef BONES\nuniform mat4 world;\nuniform mat4 mBones[BonesPerMesh];\nuniform mat4 viewProjection;\n#else\nuniform mat4 worldViewProjection;\n#endif\n\n#ifndef VSM\nvarying vec4 vPosition;\n#endif\n\nvoid main(void)\n{\n#ifdef BONES\n mat4 m0 = mBones[int(matricesIndices.x)] * matricesWeights.x;\n mat4 m1 = mBones[int(matricesIndices.y)] * matricesWeights.y;\n mat4 m2 = mBones[int(matricesIndices.z)] * matricesWeights.z;\n mat4 m3 = mBones[int(matricesIndices.w)] * matricesWeights.w;\n mat4 finalWorld = world * (m0 + m1 + m2 + m3);\n    gl_Position = viewProjection * finalWorld * vec4(position, 1.0);\n#else\n#ifndef VSM\n  vPosition = worldViewProjection * vec4(position, 1.0);\n#endif\n    gl_Position = worldViewProjection * vec4(position, 1.0);\n#endif\n}",
        spritesPixelShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform bool alphaTest;\n\nvarying vec4 vColor;\n\n// Samplers\nvarying vec2 vUV;\nuniform sampler2D diffuseSampler;\n\n// Fog\n#ifdef FOG\n\n#define FOGMODE_NONE    0.\n#define FOGMODE_EXP     1.\n#define FOGMODE_EXP2    2.\n#define FOGMODE_LINEAR  3.\n#define E 2.71828\n\nuniform vec4 vFogInfos;\nuniform vec3 vFogColor;\nvarying float fFogDistance;\n\nfloat CalcFogFactor()\n{\n   float fogCoeff = 1.0;\n float fogStart = vFogInfos.y;\n float fogEnd = vFogInfos.z;\n   float fogDensity = vFogInfos.w;\n\n if (FOGMODE_LINEAR == vFogInfos.x)\n    {\n     fogCoeff = (fogEnd - fFogDistance) / (fogEnd - fogStart);\n }\n else if (FOGMODE_EXP == vFogInfos.x)\n  {\n     fogCoeff = 1.0 / pow(E, fFogDistance * fogDensity);\n   }\n else if (FOGMODE_EXP2 == vFogInfos.x)\n {\n     fogCoeff = 1.0 / pow(E, fFogDistance * fFogDistance * fogDensity * fogDensity);\n   }\n\n   return min(1., max(0., fogCoeff));\n}\n#endif\n\n\nvoid main(void) {\n  vec4 baseColor = texture2D(diffuseSampler, vUV);\n\n    if (alphaTest) \n   {\n     if (baseColor.a < 0.95)\n           discard;\n  }\n\n   baseColor *= vColor;\n\n#ifdef FOG\n    float fog = CalcFogFactor();\n  baseColor.rgb = fog * baseColor.rgb + (1.0 - fog) * vFogColor;\n#endif\n\n  gl_FragColor = baseColor;\n}",
        spritesVertexShader: "#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Attributes\nattribute vec3 position;\nattribute vec4 options;\nattribute vec4 cellInfo;\nattribute vec4 color;\n\n// Uniforms\nuniform vec2 textureInfos;\nuniform mat4 view;\nuniform mat4 projection;\n\n// Output\nvarying vec2 vUV;\nvarying vec4 vColor;\n\n#ifdef FOG\nvarying float fFogDistance;\n#endif\n\nvoid main(void) {    \n  vec3 viewPos = (view * vec4(position, 1.0)).xyz; \n vec3 cornerPos;\n   \n  float angle = options.x;\n  float size = options.y;\n   vec2 offset = options.zw;\n vec2 uvScale = textureInfos.xy;\n\n cornerPos = vec3(offset.x - 0.5, offset.y  - 0.5, 0.) * size;\n\n   // Rotate\n vec3 rotatedCorner;\n   rotatedCorner.x = cornerPos.x * cos(angle) - cornerPos.y * sin(angle);\n    rotatedCorner.y = cornerPos.x * sin(angle) + cornerPos.y * cos(angle);\n    rotatedCorner.z = 0.;\n\n   // Position\n   viewPos += rotatedCorner;\n gl_Position = projection * vec4(viewPos, 1.0);   \n\n   // Color\n  vColor = color;\n   \n  // Texture\n    vec2 uvOffset = vec2(abs(offset.x - cellInfo.x), 1.0 - abs(offset.y - cellInfo.y));\n\n vUV = (uvOffset + cellInfo.zw) * uvScale;\n\n   // Fog\n#ifdef FOG\n    fFogDistance = viewPos.z;\n#endif\n}",
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Material = function (name, scene) {
        this.name = name;
        this.id = name;
        this._scene = scene;
        scene.materials.push(this);
    };
    BABYLON.Material.prototype.checkReadyOnEveryCall = true;
    BABYLON.Material.prototype.checkReadyOnlyOnce = false;
    BABYLON.Material.prototype.alpha = 1.0;
    BABYLON.Material.prototype.wireframe = false;
    BABYLON.Material.prototype.backFaceCulling = true;
    BABYLON.Material.prototype._effect = null;
    BABYLON.Material.prototype._wasPreviouslyReady = false;
    BABYLON.Material.prototype.onDispose = null;
    BABYLON.Material.prototype.isReady = function (mesh) {
        return true;
    };
    BABYLON.Material.prototype.getEffect = function () {
        return this._effect;
    };
    BABYLON.Material.prototype.needAlphaBlending = function () {
        return (this.alpha < 1.0);
    };
    BABYLON.Material.prototype.needAlphaTesting = function () {
        return false;
    };
    BABYLON.Material.prototype._preBind = function () {
        var engine = this._scene.getEngine();
        engine.enableEffect(this._effect);
        engine.setState(this.backFaceCulling);
    };
    BABYLON.Material.prototype.bind = function (world, mesh) {};
    BABYLON.Material.prototype.unbind = function () {};
    BABYLON.Material.prototype.baseDispose = function () {
        var index = this._scene.materials.indexOf(this);
        this._scene.materials.splice(index, 1);
        if (this.onDispose) {
            this.onDispose();
        }
    };
    BABYLON.Material.prototype.dispose = function () {
        this.baseDispose();
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.StandardMaterial = function (name, scene) {
        BABYLON.Material.call(this, name, scene);
        this.diffuseTexture = null;
        this.ambientTexture = null;
        this.opacityTexture = null;
        this.reflectionTexture = null;
        this.emissiveTexture = null;
        this.specularTexture = null;
        this.bumpTexture = null;
        this.ambientColor = new BABYLON.Color3(0, 0, 0);
        this.diffuseColor = new BABYLON.Color3(1, 1, 1);
        this.specularColor = new BABYLON.Color3(1, 1, 1);
        this.specularPower = 64;
        this.emissiveColor = new BABYLON.Color3(0, 0, 0);
        this._cachedDefines = null;
        this._renderTargets = new BABYLON.Tools.SmartArray(16);
        this._worldViewProjectionMatrix = BABYLON.Matrix.Zero();
        this._lightMatrix = BABYLON.Matrix.Zero();
        this._globalAmbientColor = new BABYLON.Color3(0, 0, 0);
        this._baseColor = new BABYLON.Color3();
        this._scaledDiffuse = new BABYLON.Color3();
        this._scaledSpecular = new BABYLON.Color3();
    };
    BABYLON.StandardMaterial.prototype = Object.create(BABYLON.Material.prototype);
    BABYLON.StandardMaterial.prototype.needAlphaBlending = function () {
        return (this.alpha < 1.0) || (this.opacityTexture != null);
    };
    BABYLON.StandardMaterial.prototype.needAlphaTesting = function () {
        return this.diffuseTexture != null && this.diffuseTexture.hasAlpha;
    };
    BABYLON.StandardMaterial.prototype.isReady = function (mesh) {
        if (this.checkReadyOnlyOnce) {
            if (this._wasPreviouslyReady) {
                return true;
            }
        }
        if (!this.checkReadyOnEveryCall) {
            if (this._renderId === this._scene.getRenderId()) {
                return true;
            }
        }
        var engine = this._scene.getEngine();
        var defines = [];
        var optionalDefines = [];
        if (this._scene.texturesEnabled) {
            if (this.diffuseTexture) {
                if (!this.diffuseTexture.isReady()) {
                    return false;
                } else {
                    defines.push("#define DIFFUSE");
                }
            }
            if (this.ambientTexture) {
                if (!this.ambientTexture.isReady()) {
                    return false;
                } else {
                    defines.push("#define AMBIENT");
                }
            }
            if (this.opacityTexture) {
                if (!this.opacityTexture.isReady()) {
                    return false;
                } else {
                    defines.push("#define OPACITY");
                }
            }
            if (this.reflectionTexture) {
                if (!this.reflectionTexture.isReady()) {
                    return false;
                } else {
                    defines.push("#define REFLECTION");
                }
            }
            if (this.emissiveTexture) {
                if (!this.emissiveTexture.isReady()) {
                    return false;
                } else {
                    defines.push("#define EMISSIVE");
                }
            }
            if (this.specularTexture) {
                if (!this.specularTexture.isReady()) {
                    return false;
                } else {
                    defines.push("#define SPECULAR");
                    optionalDefines.push(defines[defines.length - 1]);
                }
            }
        }
        if (this._scene.getEngine().getCaps().standardDerivatives && this.bumpTexture) {
            if (!this.bumpTexture.isReady()) {
                return false;
            } else {
                defines.push("#define BUMP");
                optionalDefines.push(defines[defines.length - 1]);
            }
        }
        if (BABYLON.clipPlane) {
            defines.push("#define CLIPPLANE");
        }
        if (engine.getAlphaTesting()) {
            defines.push("#define ALPHATEST");
        }
        if (this._scene.fogMode !== BABYLON.Scene.FOGMODE_NONE) {
            defines.push("#define FOG");
            optionalDefines.push(defines[defines.length - 1]);
        }
        var shadowsActivated = false;
        var lightIndex = 0;
        if (this._scene.lightsEnabled) {
            for (var index = 0; index < this._scene.lights.length; index++) {
                var light = this._scene.lights[index];
                if (!light.isEnabled()) {
                    continue;
                }
                if (mesh && light.excludedMeshes.indexOf(mesh) !== -1) {
                    continue;
                }
                defines.push("#define LIGHT" + lightIndex);
                if (lightIndex > 0) {
                    optionalDefines.push(defines[defines.length - 1]);
                }
                var type;
                if (light instanceof BABYLON.SpotLight) {
                    type = "#define SPOTLIGHT" + lightIndex;
                } else if (light instanceof BABYLON.HemisphericLight) {
                    type = "#define HEMILIGHT" + lightIndex;
                } else {
                    type = "#define POINTDIRLIGHT" + lightIndex;
                }
                defines.push(type);
                if (lightIndex > 0) {
                    optionalDefines.push(defines[defines.length - 1]);
                }
                var shadowGenerator = light.getShadowGenerator();
                if (mesh && mesh.receiveShadows && shadowGenerator) {
                    defines.push("#define SHADOW" + lightIndex);
                    if (lightIndex > 0) {
                        optionalDefines.push(defines[defines.length - 1]);
                    }
                    if (!shadowsActivated) {
                        defines.push("#define SHADOWS");
                        shadowsActivated = true;
                    }
                    if (shadowGenerator.useVarianceShadowMap) {
                        defines.push("#define SHADOWVSM" + lightIndex);
                        if (lightIndex > 0) {
                            optionalDefines.push(defines[defines.length - 1]);
                        }
                    }
                }
                lightIndex++;
                if (lightIndex == 4) break;
            }
        }
        var attribs = [BABYLON.VertexBuffer.PositionKind, BABYLON.VertexBuffer.NormalKind];
        if (mesh) {
            if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.UVKind)) {
                attribs.push(BABYLON.VertexBuffer.UVKind);
                defines.push("#define UV1");
            }
            if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.UV2Kind)) {
                attribs.push(BABYLON.VertexBuffer.UV2Kind);
                defines.push("#define UV2");
            }
            if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.ColorKind)) {
                attribs.push(BABYLON.VertexBuffer.ColorKind);
                defines.push("#define VERTEXCOLOR");
            }
            if (mesh.skeleton && mesh.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesIndicesKind) && mesh.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesWeightsKind)) {
                attribs.push(BABYLON.VertexBuffer.MatricesIndicesKind);
                attribs.push(BABYLON.VertexBuffer.MatricesWeightsKind);
                defines.push("#define BONES");
                defines.push("#define BonesPerMesh " + mesh.skeleton.bones.length);
                defines.push("#define BONES4");
                optionalDefines.push(defines[defines.length - 1]);
            }
        }
        var join = defines.join("\n");
        if (this._cachedDefines != join) {
            this._cachedDefines = join;
            var shaderName = "default";
            if (!this._scene.getEngine().getCaps().standardDerivatives) {
                shaderName = "legacydefault";
            }
            this._effect = this._scene.getEngine().createEffect(shaderName, attribs, ["world", "view", "viewProjection", "vEyePosition", "vLightsType", "vAmbientColor", "vDiffuseColor", "vSpecularColor", "vEmissiveColor", "vLightData0", "vLightDiffuse0", "vLightSpecular0", "vLightDirection0", "vLightGround0", "lightMatrix0", "vLightData1", "vLightDiffuse1", "vLightSpecular1", "vLightDirection1", "vLightGround1", "lightMatrix1", "vLightData2", "vLightDiffuse2", "vLightSpecular2", "vLightDirection2", "vLightGround2", "lightMatrix2", "vLightData3", "vLightDiffuse3", "vLightSpecular3", "vLightDirection3", "vLightGround3", "lightMatrix3", "vFogInfos", "vFogColor", "vDiffuseInfos", "vAmbientInfos", "vOpacityInfos", "vReflectionInfos", "vEmissiveInfos", "vSpecularInfos", "vBumpInfos", "mBones", "vClipPlane", "diffuseMatrix", "ambientMatrix", "opacityMatrix", "reflectionMatrix", "emissiveMatrix", "specularMatrix", "bumpMatrix"], ["diffuseSampler", "ambientSampler", "opacitySampler", "reflectionCubeSampler", "reflection2DSampler", "emissiveSampler", "specularSampler", "bumpSampler", "shadowSampler0", "shadowSampler1", "shadowSampler2", "shadowSampler3"], join, optionalDefines);
        }
        if (!this._effect.isReady()) {
            return false;
        }
        this._renderId = this._scene.getRenderId();
        this._wasPreviouslyReady = true;
        return true;
    };
    BABYLON.StandardMaterial.prototype.getRenderTargetTextures = function () {
        this._renderTargets.reset();
        if (this.reflectionTexture && this.reflectionTexture.isRenderTarget) {
            this._renderTargets.push(this.reflectionTexture);
        }
        return this._renderTargets;
    };
    BABYLON.StandardMaterial.prototype.unbind = function () {
        if (this.reflectionTexture && this.reflectionTexture.isRenderTarget) {
            this._effect.setTexture("reflection2DSampler", null);
        }
    };
    BABYLON.StandardMaterial.prototype.bind = function (world, mesh) {
        this._baseColor.copyFrom(this.diffuseColor);
        this._effect.setMatrix("world", world);
        this._effect.setMatrix("viewProjection", this._scene.getTransformMatrix());
        if (mesh.skeleton && mesh.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesIndicesKind) && mesh.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesWeightsKind)) {
            this._effect.setMatrices("mBones", mesh.skeleton.getTransformMatrices());
        }
        if (this.diffuseTexture) {
            this._effect.setTexture("diffuseSampler", this.diffuseTexture);
            this._effect.setFloat2("vDiffuseInfos", this.diffuseTexture.coordinatesIndex, this.diffuseTexture.level);
            this._effect.setMatrix("diffuseMatrix", this.diffuseTexture._computeTextureMatrix());
            this._baseColor.copyFromFloats(1, 1, 1);
        }
        if (this.ambientTexture) {
            this._effect.setTexture("ambientSampler", this.ambientTexture);
            this._effect.setFloat2("vAmbientInfos", this.ambientTexture.coordinatesIndex, this.ambientTexture.level);
            this._effect.setMatrix("ambientMatrix", this.ambientTexture._computeTextureMatrix());
        }
        if (this.opacityTexture) {
            this._effect.setTexture("opacitySampler", this.opacityTexture);
            this._effect.setFloat2("vOpacityInfos", this.opacityTexture.coordinatesIndex, this.opacityTexture.level);
            this._effect.setMatrix("opacityMatrix", this.opacityTexture._computeTextureMatrix());
        }
        if (this.reflectionTexture) {
            if (this.reflectionTexture.isCube) {
                this._effect.setTexture("reflectionCubeSampler", this.reflectionTexture);
            } else {
                this._effect.setTexture("reflection2DSampler", this.reflectionTexture);
            }
            this._effect.setMatrix("reflectionMatrix", this.reflectionTexture._computeReflectionTextureMatrix());
            this._effect.setFloat3("vReflectionInfos", this.reflectionTexture.coordinatesMode, this.reflectionTexture.level, this.reflectionTexture.isCube ? 1 : 0);
        }
        if (this.emissiveTexture) {
            this._effect.setTexture("emissiveSampler", this.emissiveTexture);
            this._effect.setFloat2("vEmissiveInfos", this.emissiveTexture.coordinatesIndex, this.emissiveTexture.level);
            this._effect.setMatrix("emissiveMatrix", this.emissiveTexture._computeTextureMatrix());
        }
        if (this.specularTexture) {
            this._effect.setTexture("specularSampler", this.specularTexture);
            this._effect.setFloat2("vSpecularInfos", this.specularTexture.coordinatesIndex, this.specularTexture.level);
            this._effect.setMatrix("specularMatrix", this.specularTexture._computeTextureMatrix());
        }
        if (this.bumpTexture && this._scene.getEngine().getCaps().standardDerivatives) {
            this._effect.setTexture("bumpSampler", this.bumpTexture);
            this._effect.setFloat2("vBumpInfos", this.bumpTexture.coordinatesIndex, this.bumpTexture.level);
            this._effect.setMatrix("bumpMatrix", this.bumpTexture._computeTextureMatrix());
        }
        this._scene.ambientColor.multiplyToRef(this.ambientColor, this._globalAmbientColor);
        this._effect.setVector3("vEyePosition", this._scene.activeCamera.position);
        this._effect.setColor3("vAmbientColor", this._globalAmbientColor);
        this._effect.setColor4("vDiffuseColor", this._baseColor, this.alpha * mesh.visibility);
        this._effect.setColor4("vSpecularColor", this.specularColor, this.specularPower);
        this._effect.setColor3("vEmissiveColor", this.emissiveColor);
        if (this._scene.lightsEnabled) {
            var lightIndex = 0;
            for (var index = 0; index < this._scene.lights.length; index++) {
                var light = this._scene.lights[index];
                if (!light.isEnabled()) {
                    continue;
                }
                if (mesh && light.excludedMeshes.indexOf(mesh) !== -1) {
                    continue;
                }
                if (light instanceof BABYLON.PointLight) {
                    light.transferToEffect(this._effect, "vLightData" + lightIndex);
                } else if (light instanceof BABYLON.DirectionalLight) {
                    light.transferToEffect(this._effect, "vLightData" + lightIndex);
                } else if (light instanceof BABYLON.SpotLight) {
                    light.transferToEffect(this._effect, "vLightData" + lightIndex, "vLightDirection" + lightIndex);
                } else if (light instanceof BABYLON.HemisphericLight) {
                    light.transferToEffect(this._effect, "vLightData" + lightIndex, "vLightGround" + lightIndex);
                }
                light.diffuse.scaleToRef(light.intensity, this._scaledDiffuse);
                light.specular.scaleToRef(light.intensity, this._scaledSpecular);
                this._effect.setColor3("vLightDiffuse" + lightIndex, this._scaledDiffuse);
                this._effect.setColor3("vLightSpecular" + lightIndex, this._scaledSpecular);
                var shadowGenerator = light.getShadowGenerator();
                if (mesh.receiveShadows && shadowGenerator) {
                    world.multiplyToRef(shadowGenerator.getTransformMatrix(), this._lightMatrix);
                    this._effect.setMatrix("lightMatrix" + lightIndex, this._lightMatrix);
                    this._effect.setTexture("shadowSampler" + lightIndex, shadowGenerator.getShadowMap());
                }
                lightIndex++;
                if (lightIndex == 4) break;
            }
        }
        if (BABYLON.clipPlane) {
            this._effect.setFloat4("vClipPlane", BABYLON.clipPlane.normal.x, BABYLON.clipPlane.normal.y, BABYLON.clipPlane.normal.z, BABYLON.clipPlane.d);
        }
        if (this._scene.fogMode !== BABYLON.Scene.FOGMODE_NONE || this.reflectionTexture) {
            this._effect.setMatrix("view", this._scene.getViewMatrix());
        }
        if (this._scene.fogMode !== BABYLON.Scene.FOGMODE_NONE) {
            this._effect.setFloat4("vFogInfos", this._scene.fogMode, this._scene.fogStart, this._scene.fogEnd, this._scene.fogDensity);
            this._effect.setColor3("vFogColor", this._scene.fogColor);
        }
    };
    BABYLON.StandardMaterial.prototype.getAnimatables = function () {
        var results = [];
        if (this.diffuseTexture && this.diffuseTexture.animations && this.diffuseTexture.animations.length > 0) {
            results.push(this.diffuseTexture);
        }
        if (this.ambientTexture && this.ambientTexture.animations && this.ambientTexture.animations.length > 0) {
            results.push(this.ambientTexture);
        }
        if (this.opacityTexture && this.opacityTexture.animations && this.opacityTexture.animations.length > 0) {
            results.push(this.opacityTexture);
        }
        if (this.reflectionTexture && this.reflectionTexture.animations && this.reflectionTexture.animations.length > 0) {
            results.push(this.reflectionTexture);
        }
        if (this.emissiveTexture && this.emissiveTexture.animations && this.emissiveTexture.animations.length > 0) {
            results.push(this.emissiveTexture);
        }
        if (this.specularTexture && this.specularTexture.animations && this.specularTexture.animations.length > 0) {
            results.push(this.specularTexture);
        }
        if (this.bumpTexture && this.bumpTexture.animations && this.bumpTexture.animations.length > 0) {
            results.push(this.bumpTexture);
        }
        return results;
    };
    BABYLON.StandardMaterial.prototype.dispose = function () {
        if (this.diffuseTexture) {
            this.diffuseTexture.dispose();
        }
        if (this.ambientTexture) {
            this.ambientTexture.dispose();
        }
        if (this.opacityTexture) {
            this.opacityTexture.dispose();
        }
        if (this.reflectionTexture) {
            this.reflectionTexture.dispose();
        }
        if (this.emissiveTexture) {
            this.emissiveTexture.dispose();
        }
        if (this.specularTexture) {
            this.specularTexture.dispose();
        }
        if (this.bumpTexture) {
            this.bumpTexture.dispose();
        }
        this.baseDispose();
    };
    BABYLON.StandardMaterial.prototype.clone = function (name) {
        var newStandardMaterial = new BABYLON.StandardMaterial(name, this._scene);
        newStandardMaterial.checkReadyOnEveryCall = this.checkReadyOnEveryCall;
        newStandardMaterial.alpha = this.alpha;
        newStandardMaterial.wireframe = this.wireframe;
        newStandardMaterial.backFaceCulling = this.backFaceCulling;
        if (this.diffuseTexture && this.diffuseTexture.clone) {
            newStandardMaterial.diffuseTexture = this.diffuseTexture.clone();
        }
        if (this.ambientTexture && this.ambientTexture.clone) {
            newStandardMaterial.ambientTexture = this.ambientTexture.clone();
        }
        if (this.opacityTexture && this.opacityTexture.clone) {
            newStandardMaterial.opacityTexture = this.opacityTexture.clone();
        }
        if (this.reflectionTexture && this.reflectionTexture.clone) {
            newStandardMaterial.reflectionTexture = this.reflectionTexture.clone();
        }
        if (this.emissiveTexture && this.emissiveTexture.clone) {
            newStandardMaterial.emissiveTexture = this.emissiveTexture.clone();
        }
        if (this.specularTexture && this.specularTexture.clone) {
            newStandardMaterial.specularTexture = this.specularTexture.clone();
        }
        if (this.bumpTexture && this.bumpTexture.clone) {
            newStandardMaterial.bumpTexture = this.bumpTexture.clone();
        }
        newStandardMaterial.ambientColor = this.ambientColor.clone();
        newStandardMaterial.diffuseColor = this.diffuseColor.clone();
        newStandardMaterial.specularColor = this.specularColor.clone();
        newStandardMaterial.specularPower = this.specularPower;
        newStandardMaterial.emissiveColor = this.emissiveColor.clone();
        return newStandardMaterial;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.MultiMaterial = function (name, scene) {
        this.name = name;
        this.id = name;
        this._scene = scene;
        scene.multiMaterials.push(this);
        this.subMaterials = [];
    };
    BABYLON.MultiMaterial.prototype.getSubMaterial = function (index) {
        if (index < 0 || index >= this.subMaterials.length) {
            return this._scene.defaultMaterial;
        }
        return this.subMaterials[index];
    };
    BABYLON.MultiMaterial.prototype.isReady = function (mesh) {
        var result = true;
        for (var index = 0; index < this.subMaterials.length; index++) {
            var subMaterial = this.subMaterials[index];
            if (subMaterial) {
                result &= this.subMaterials[index].isReady(mesh);
            }
        }
        return result;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    function parseURL(url) {
        var a = document.createElement('a');
        a.href = url;
        var fileName = url.substring(url.lastIndexOf("/") + 1, url.length);
        var absLocation = url.substring(0, url.indexOf(fileName, 0));
        return absLocation;
    };
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    BABYLON.Database = function (urlToScene) {
        this.currentSceneUrl = BABYLON.Database.ReturnFullUrlLocation(urlToScene);
        this.db = null;
        this.enableSceneOffline = false;
        this.enableTexturesOffline = false;
        this.manifestVersionFound = 0;
        this.mustUpdateRessources = false;
        this.hasReachedQuota = false;
        this.checkManifestFile();
    };
    BABYLON.Database.isUASupportingBlobStorage = true;
    BABYLON.Database.ReturnFullUrlLocation = function (url) {
        if (url.indexOf("http:/") === -1) {
            return (parseURL(window.location.href) + url);
        } else {
            return url;
        }
    };
    BABYLON.Database.prototype.checkManifestFile = function () {
        function noManifestFile() {
            console.log("Valid manifest file not found. Scene & textures will be loaded directly from the web server.");
            that.enableSceneOffline = false;
            that.enableTexturesOffline = false;
        };
        var that = this;
        var manifestURL = this.currentSceneUrl + ".manifest";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", manifestURL, false);
        xhr.addEventListener("load", function () {
            if (xhr.status === 200) {
                try {
                    var manifestFile = JSON.parse(xhr.response);
                    that.enableSceneOffline = manifestFile.enableSceneOffline;
                    that.enableTexturesOffline = manifestFile.enableTexturesOffline;
                    if (manifestFile.version && !isNaN(parseInt(manifestFile.version))) {
                        that.manifestVersionFound = manifestFile.version;
                    }
                } catch (ex) {
                    noManifestFile();
                }
            } else {
                noManifestFile();
            }
        }, false);
        xhr.addEventListener("error", function (event) {
            noManifestFile();
        }, false);
        try {
            xhr.send();
        } catch (ex) {
            console.log("Error on XHR send request.");
        }
    };
    BABYLON.Database.prototype.openAsync = function (successCallback, errorCallback) {
        function handleError() {
            that.isSupported = false;
            if (errorCallback) errorCallback();
        }
        var that = this;
        if (!indexedDB || !(this.enableSceneOffline || this.enableTexturesOffline)) {
            this.isSupported = false;
            if (errorCallback) errorCallback();
        } else {
            if (!this.db) {
                this.hasReachedQuota = false;
                this.isSupported = true;
                var request = indexedDB.open("babylonjs", 1.0);
                request.onerror = function (event) {
                    handleError();
                };
                request.onblocked = function (event) {
                    console.log("IDB request blocked. Please reload the page.");
                    handleError();
                };
                request.onsuccess = function (event) {
                    that.db = request.result;
                    successCallback();
                };
                request.onupgradeneeded = function (event) {
                    that.db = event.target.result;
                    try {
                        var scenesStore = that.db.createObjectStore("scenes", {
                            keyPath: "sceneUrl"
                        });
                        var versionsStore = that.db.createObjectStore("versions", {
                            keyPath: "sceneUrl"
                        });
                        var texturesStore = that.db.createObjectStore("textures", {
                            keyPath: "textureUrl"
                        });
                    } catch (ex) {
                        console.log("Error while creating object stores. Exception: " + ex.message);
                        handleError();
                    }
                };
            } else {
                if (successCallback) successCallback();
            }
        }
    };
    BABYLON.Database.prototype.loadImageFromDB = function (url, image) {
        var that = this;
        var completeURL = BABYLON.Database.ReturnFullUrlLocation(url);
        var saveAndLoadImage = function (event) {
            if (!that.hasReachedQuota && that.db !== null) {
                that._saveImageIntoDBAsync(completeURL, image);
            } else {
                image.src = url;
            }
        };
        if (!this.mustUpdateRessources) {
            this._loadImageFromDBAsync(completeURL, image, saveAndLoadImage);
        } else {
            saveAndLoadImage();
        }
    };
    BABYLON.Database.prototype._loadImageFromDBAsync = function (url, image, notInDBCallback) {
        if (this.isSupported && this.db !== null) {
            var texture;
            var transaction = this.db.transaction(["textures"]);
            transaction.onabort = function (event) {
                image.src = url;
            };
            transaction.oncomplete = function (event) {
                var blobTextureURL;
                if (texture) {
                    var URL = window.URL || window.webkitURL;
                    blobTextureURL = URL.createObjectURL(texture.data, {
                        oneTimeOnly: true
                    });
                    image.src = blobTextureURL;
                } else {
                    notInDBCallback();
                }
            };
            var getRequest = transaction.objectStore("textures").get(url);
            getRequest.onsuccess = function (event) {
                texture = event.target.result;
            };
            getRequest.onerror = function (event) {
                console.log("Error loading texture " + url + " from DB.");
                image.src = url;
            };
        } else {
            console.log("Error: IndexedDB not supported by your browser or BabylonJS Database is not open.");
            image.src = url;
        }
    };
    BABYLON.Database.prototype._saveImageIntoDBAsync = function (url, image) {
        if (this.isSupported) {
            var generateBlobUrl = function () {
                var blobTextureURL;
                if (blob) {
                    var URL = window.URL || window.webkitURL;
                    try {
                        blobTextureURL = URL.createObjectURL(blob, {
                            oneTimeOnly: true
                        });
                    } catch (ex) {
                        blobTextureURL = URL.createObjectURL(blob);
                    }
                }
                image.src = blobTextureURL;
            };
            if (BABYLON.Database.isUASupportingBlobStorage) {
                var that = this;
                var xhr = new XMLHttpRequest(),
                    blob;
                xhr.open("GET", url, true);
                xhr.responseType = "blob";
                xhr.addEventListener("load", function () {
                    if (xhr.status === 200) {
                        blob = xhr.response;
                        var transaction = that.db.transaction(["textures"], "readwrite");
                        transaction.onabort = function (event) {
                            try {
                                if (event.srcElement.error.name === "QuotaExceededError") {
                                    that.hasReachedQuota = true;
                                }
                            } catch (ex) {}
                            generateBlobUrl();
                        };
                        transaction.oncomplete = function (event) {
                            generateBlobUrl();
                        };
                        var newTexture = {};
                        newTexture.textureUrl = url;
                        newTexture.data = blob;
                        try {
                            var addRequest = transaction.objectStore("textures").put(newTexture);
                            addRequest.onsuccess = function (event) {
                                console.log("");
                            };
                            addRequest.onerror = function (event) {
                                generateBlobUrl();
                            };
                        } catch (ex) {
                            if (ex.code === 25) {
                                BABYLON.Database.isUASupportingBlobStorage = false;
                            }
                            image.src = url;
                        }
                    } else {
                        image.src = url;
                    }
                }, false);
                xhr.addEventListener("error", function (event) {
                    console.log("Error in XHR request in BABYLON.Database.");
                    image.src = url;
                }, false);
                xhr.send();
            } else {
                image.src = url;
            }
        } else {
            console.log("Error: IndexedDB not supported by your browser or BabylonJS Database is not open.");
            image.src = url;
        }
    };
    BABYLON.Database.prototype._checkVersionFromDB = function (url, versionLoaded) {
        var that = this;
        var updateVersion = function (event) {
            that._saveVersionIntoDBAsync(url, versionLoaded);
        };
        this._loadVersionFromDBAsync(url, versionLoaded, updateVersion);
    };
    BABYLON.Database.prototype._loadVersionFromDBAsync = function (url, callback, updateInDBCallback) {
        if (this.isSupported) {
            var version;
            var that = this;
            try {
                var transaction = this.db.transaction(["versions"]);
                transaction.oncomplete = function (event) {
                    if (version) {
                        if (that.manifestVersionFound > version.data) {
                            that.mustUpdateRessources = true;
                            updateInDBCallback();
                        } else {
                            callback(version.data);
                        }
                    } else {
                        that.mustUpdateRessources = true;
                        updateInDBCallback();
                    }
                };
                transaction.onabort = function (event) {
                    callback(-1);
                };
                var getRequest = transaction.objectStore("versions").get(url);
                getRequest.onsuccess = function (event) {
                    version = event.target.result;
                };
                getRequest.onerror = function (event) {
                    console.log("Error loading version for scene " + url + " from DB.");
                    callback(-1);
                };
            } catch (ex) {
                console.log("Error while accessing 'versions' object store (READ OP). Exception: " + ex.message);
                callback(-1);
            }
        } else {
            console.log("Error: IndexedDB not supported by your browser or BabylonJS Database is not open.");
            callback(-1);
        }
    };
    BABYLON.Database.prototype._saveVersionIntoDBAsync = function (url, callback) {
        if (this.isSupported && !this.hasReachedQuota) {
            var that = this;
            try {
                var transaction = this.db.transaction(["versions"], "readwrite");
                transaction.onabort = function (event) {
                    try {
                        if (event.srcElement.error.name === "QuotaExceededError") {
                            that.hasReachedQuota = true;
                        }
                    } catch (ex) {}
                    callback(-1);
                };
                transaction.oncomplete = function (event) {
                    callback(that.manifestVersionFound);
                };
                var newVersion = {};
                newVersion.sceneUrl = url;
                newVersion.data = this.manifestVersionFound;
                var addRequest = transaction.objectStore("versions").put(newVersion);
                addRequest.onsuccess = function (event) {
                    console.log("");
                };
                addRequest.onerror = function (event) {
                    console.log("Error in DB add version request in BABYLON.Database.");
                };
            } catch (ex) {
                console.log("Error while accessing 'versions' object store (WRITE OP). Exception: " + ex.message);
                callback(-1);
            }
        } else {
            callback(-1);
        }
    };
    BABYLON.Database.prototype.loadSceneFromDB = function (url, sceneLoaded, progressCallBack, errorCallback) {
        var that = this;
        var completeUrl = BABYLON.Database.ReturnFullUrlLocation(url);
        var saveAndLoadScene = function (event) {
            that._saveSceneIntoDBAsync(completeUrl, sceneLoaded, progressCallBack);
        };
        this._checkVersionFromDB(completeUrl, function (version) {
            if (version !== -1) {
                if (!that.mustUpdateRessources) {
                    that._loadSceneFromDBAsync(completeUrl, sceneLoaded, saveAndLoadScene);
                } else {
                    that._saveSceneIntoDBAsync(completeUrl, sceneLoaded, progressCallBack);
                }
            } else {
                errorCallback();
            }
        });
    };
    BABYLON.Database.prototype._loadSceneFromDBAsync = function (url, callback, notInDBCallback) {
        if (this.isSupported) {
            var scene;
            var transaction = this.db.transaction(["scenes"]);
            transaction.oncomplete = function (event) {
                if (scene) {
                    callback(scene.data);
                } else {
                    notInDBCallback();
                }
            };
            transaction.onabort = function (event) {
                notInDBCallback();
            };
            var getRequest = transaction.objectStore("scenes").get(url);
            getRequest.onsuccess = function (event) {
                scene = event.target.result;
            };
            getRequest.onerror = function (event) {
                console.log("Error loading scene " + url + " from DB.");
                notInDBCallback();
            };
        } else {
            console.log("Error: IndexedDB not supported by your browser or BabylonJS Database is not open.");
            callback();
        }
    };
    BABYLON.Database.prototype._saveSceneIntoDBAsync = function (url, callback, progressCallback) {
        if (this.isSupported) {
            var xhr = new XMLHttpRequest(),
                sceneText;
            var that = this;
            xhr.open("GET", url, true);
            xhr.onprogress = progressCallback;
            xhr.addEventListener("load", function () {
                if (xhr.status === 200) {
                    sceneText = xhr.responseText;
                    if (!that.hasReachedQuota) {
                        var transaction = that.db.transaction(["scenes"], "readwrite");
                        transaction.onabort = function (event) {
                            try {
                                if (event.srcElement.error.name === "QuotaExceededError") {
                                    that.hasReachedQuota = true;
                                }
                            } catch (ex) {}
                            callback(sceneText);
                        };
                        transaction.oncomplete = function (event) {
                            callback(sceneText);
                        };
                        var newScene = {};
                        newScene.sceneUrl = url;
                        newScene.data = sceneText;
                        newScene.version = that.manifestVersionFound;
                        try {
                            var addRequest = transaction.objectStore("scenes").put(newScene);
                            addRequest.onsuccess = function (event) {
                                console.log("");
                            };
                            addRequest.onerror = function (event) {
                                console.log("Error in DB add scene request in BABYLON.Database.");
                            };
                        } catch (ex) {
                            callback(sceneText);
                        }
                    } else {
                        callback(sceneText);
                    }
                } else {
                    callback();
                }
            }, false);
            xhr.addEventListener("error", function (event) {
                console.log("error on XHR request.");
                callback();
            }, false);
            xhr.send();
        } else {
            console.log("Error: IndexedDB not supported by your browser or BabylonJS Database is not open.");
            callback();
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.SpriteManager = function (name, imgUrl, capacity, cellSize, scene, epsilon) {
        this.name = name;
        this._capacity = capacity;
        this.cellSize = cellSize;
        this._spriteTexture = new BABYLON.Texture(imgUrl, scene, true, false);
        this._spriteTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        this._spriteTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        this._epsilon = epsilon === undefined ? 0.01 : epsilon;
        this._scene = scene;
        this._scene.spriteManagers.push(this);
        this._vertexDeclaration = [3, 4, 4, 4];
        this._vertexStrideSize = 15 * 4;
        this._vertexBuffer = scene.getEngine().createDynamicVertexBuffer(capacity * this._vertexStrideSize * 4);
        var indices = [];
        var index = 0;
        for (var count = 0; count < capacity; count++) {
            indices.push(index);
            indices.push(index + 1);
            indices.push(index + 2);
            indices.push(index);
            indices.push(index + 2);
            indices.push(index + 3);
            index += 4;
        }
        this._indexBuffer = scene.getEngine().createIndexBuffer(indices);
        this._vertices = new Float32Array(capacity * this._vertexStrideSize);
        this.sprites = [];
        this._effectBase = this._scene.getEngine().createEffect("sprites", ["position", "options", "cellInfo", "color"], ["view", "projection", "textureInfos", "alphaTest"], ["diffuseSampler"], "");
        this._effectFog = this._scene.getEngine().createEffect("sprites", ["position", "options", "cellInfo", "color"], ["view", "projection", "textureInfos", "alphaTest", "vFogInfos", "vFogColor"], ["diffuseSampler"], "#define FOG");
    };
    BABYLON.SpriteManager.prototype.renderingGroupId = 0;
    BABYLON.SpriteManager.prototype.onDispose = null;
    BABYLON.SpriteManager.prototype._appendSpriteVertex = function (index, sprite, offsetX, offsetY, rowSize) {
        var arrayOffset = index * 15;
        if (offsetX == 0) offsetX = this._epsilon;
        else if (offsetX == 1) offsetX = 1 - this._epsilon;
        if (offsetY == 0) offsetY = this._epsilon;
        else if (offsetY == 1) offsetY = 1 - this._epsilon;
        this._vertices[arrayOffset] = sprite.position.x;
        this._vertices[arrayOffset + 1] = sprite.position.y;
        this._vertices[arrayOffset + 2] = sprite.position.z;
        this._vertices[arrayOffset + 3] = sprite.angle;
        this._vertices[arrayOffset + 4] = sprite.size;
        this._vertices[arrayOffset + 5] = offsetX;
        this._vertices[arrayOffset + 6] = offsetY;
        this._vertices[arrayOffset + 7] = sprite.invertU ? 1 : 0;
        this._vertices[arrayOffset + 8] = sprite.invertV ? 1 : 0;
        var offset = (sprite.cellIndex / rowSize) >> 0;
        this._vertices[arrayOffset + 9] = sprite.cellIndex - offset * rowSize;
        this._vertices[arrayOffset + 10] = offset;
        this._vertices[arrayOffset + 11] = sprite.color.r;
        this._vertices[arrayOffset + 12] = sprite.color.g;
        this._vertices[arrayOffset + 13] = sprite.color.b;
        this._vertices[arrayOffset + 14] = sprite.color.a;
    };
    BABYLON.SpriteManager.prototype.render = function () {
        if (!this._effectBase.isReady() || !this._effectFog.isReady() || !this._spriteTexture || !this._spriteTexture.isReady()) return 0;
        var engine = this._scene.getEngine();
        var baseSize = this._spriteTexture.getBaseSize();
        var deltaTime = BABYLON.Tools.GetDeltaTime();
        var max = Math.min(this._capacity, this.sprites.length);
        var rowSize = baseSize.width / this.cellSize;
        var offset = 0;
        for (var index = 0; index < max; index++) {
            var sprite = this.sprites[index];
            if (!sprite) {
                continue;
            }
            sprite._animate(deltaTime);
            this._appendSpriteVertex(offset++, sprite, 0, 0, rowSize);
            this._appendSpriteVertex(offset++, sprite, 1, 0, rowSize);
            this._appendSpriteVertex(offset++, sprite, 1, 1, rowSize);
            this._appendSpriteVertex(offset++, sprite, 0, 1, rowSize);
        }
        engine.updateDynamicVertexBuffer(this._vertexBuffer, this._vertices, max * this._vertexStrideSize);
        var effect = this._effectBase;
        if (this._scene.fogMode !== BABYLON.Scene.FOGMODE_NONE) {
            effect = this._effectFog;
        }
        engine.enableEffect(effect);
        var viewMatrix = this._scene.getViewMatrix();
        effect.setTexture("diffuseSampler", this._spriteTexture);
        effect.setMatrix("view", viewMatrix);
        effect.setMatrix("projection", this._scene.getProjectionMatrix());
        effect.setFloat2("textureInfos", this.cellSize / baseSize.width, this.cellSize / baseSize.height);
        if (this._scene.fogMode !== BABYLON.Scene.FOGMODE_NONE) {
            effect.setFloat4("vFogInfos", this._scene.fogMode, this._scene.fogStart, this._scene.fogEnd, this._scene.fogDensity);
            effect.setColor3("vFogColor", this._scene.fogColor);
        }
        engine.bindBuffers(this._vertexBuffer, this._indexBuffer, this._vertexDeclaration, this._vertexStrideSize, effect);
        effect.setBool("alphaTest", true);
        engine.setColorWrite(false);
        engine.draw(true, 0, max * 6);
        engine.setColorWrite(true);
        effect.setBool("alphaTest", false);
        engine.setAlphaMode(BABYLON.Engine.ALPHA_COMBINE);
        engine.draw(true, 0, max * 6);
        engine.setAlphaMode(BABYLON.Engine.ALPHA_DISABLE);
    };
    BABYLON.SpriteManager.prototype.dispose = function () {
        if (this._vertexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._vertexBuffer);
            this._vertexBuffer = null;
        }
        if (this._indexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }
        if (this._spriteTexture) {
            this._spriteTexture.dispose();
            this._spriteTexture = null;
        }
        var index = this._scene.spriteManagers.indexOf(this);
        this._scene.spriteManagers.splice(index, 1);
        if (this.onDispose) {
            this.onDispose();
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Sprite = function (name, manager) {
        this.name = name;
        this._manager = manager;
        this._manager.sprites.push(this);
        this.position = BABYLON.Vector3.Zero();
        this.color = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
        this._frameCount = 0;
    };
    BABYLON.Sprite.prototype.position = null;
    BABYLON.Sprite.prototype.size = 1.0;
    BABYLON.Sprite.prototype.angle = 0;
    BABYLON.Sprite.prototype.cellIndex = 0;
    BABYLON.Sprite.prototype.invertU = 0;
    BABYLON.Sprite.prototype.invertV = 0;
    BABYLON.Sprite.prototype.disposeWhenFinishedAnimating = false;
    BABYLON.Sprite.prototype._animationStarted = false;
    BABYLON.Sprite.prototype._loopAnimation = false;
    BABYLON.Sprite.prototype._fromIndex = false;
    BABYLON.Sprite.prototype._toIndex = false;
    BABYLON.Sprite.prototype._delay = false;
    BABYLON.Sprite.prototype._direction = 1;
    BABYLON.Sprite.prototype.playAnimation = function (from, to, loop, delay) {
        this._fromIndex = from;
        this._toIndex = to;
        this._loopAnimation = loop;
        this._delay = delay;
        this._animationStarted = true;
        this._direction = from < to ? 1 : -1;
        this.cellIndex = from;
        this._time = 0;
    };
    BABYLON.Sprite.prototype.stopAnimation = function () {
        this._animationStarted = false;
    };
    BABYLON.Sprite.prototype._animate = function (deltaTime) {
        if (!this._animationStarted) return;
        this._time += deltaTime;
        if (this._time > this._delay) {
            this._time = this._time % this._delay;
            this.cellIndex += this._direction;
            if (this.cellIndex == this._toIndex) {
                if (this._loopAnimation) {
                    this.cellIndex = this._fromIndex;
                } else {
                    this._animationStarted = false;
                    if (this.disposeWhenFinishedAnimating) {
                        this.dispose();
                    }
                }
            }
        }
    };
    BABYLON.Sprite.prototype.dispose = function () {
        for (var i = 0; i < this._manager.sprites.length; i++) {
            if (this._manager.sprites[i] == this) {
                this._manager.sprites.splice(i, 1);
            }
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Layer = function (name, imgUrl, scene, isBackground, color) {
        this.name = name;
        this.texture = imgUrl ? new BABYLON.Texture(imgUrl, scene, true) : null;
        this.isBackground = isBackground === undefined ? true : isBackground;
        this.color = color === undefined ? new BABYLON.Color4(1, 1, 1, 1) : color;
        this._scene = scene;
        this._scene.layers.push(this);
        var vertices = [];
        vertices.push(1, 1);
        vertices.push(-1, 1);
        vertices.push(-1, -1);
        vertices.push(1, -1);
        this._vertexDeclaration = [2];
        this._vertexStrideSize = 2 * 4;
        this._vertexBuffer = scene.getEngine().createVertexBuffer(vertices);
        var indices = [];
        indices.push(0);
        indices.push(1);
        indices.push(2);
        indices.push(0);
        indices.push(2);
        indices.push(3);
        this._indexBuffer = scene.getEngine().createIndexBuffer(indices);
        this._effect = this._scene.getEngine().createEffect("layer", ["position"], ["textureMatrix", "color"], ["textureSampler"], "");
    };
    BABYLON.Layer.prototype.onDispose = null;
    BABYLON.Layer.prototype.render = function () {
        if (!this._effect.isReady() || !this.texture || !this.texture.isReady()) return;
        var engine = this._scene.getEngine();
        engine.enableEffect(this._effect);
        engine.setState(false);
        this._effect.setTexture("textureSampler", this.texture);
        this._effect.setMatrix("textureMatrix", this.texture._computeTextureMatrix());
        this._effect.setFloat4("color", this.color.r, this.color.g, this.color.b, this.color.a);
        engine.bindBuffers(this._vertexBuffer, this._indexBuffer, this._vertexDeclaration, this._vertexStrideSize, this._effect);
        engine.setAlphaMode(BABYLON.Engine.ALPHA_COMBINE);
        engine.draw(true, 0, 6);
        engine.setAlphaMode(BABYLON.Engine.ALPHA_DISABLE);
    };
    BABYLON.Layer.prototype.dispose = function () {
        if (this._vertexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._vertexBuffer);
            this._vertexBuffer = null;
        }
        if (this._indexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }
        if (this.texture) {
            this.texture.dispose();
            this.texture = null;
        }
        var index = this._scene.layers.indexOf(this);
        this._scene.layers.splice(index, 1);
        if (this.onDispose) {
            this.onDispose();
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Particle = function () {
        this.position = BABYLON.Vector3.Zero();
        this.direction = BABYLON.Vector3.Zero();
        this.color = new BABYLON.Color4(0, 0, 0, 0);
        this.colorStep = new BABYLON.Color4(0, 0, 0, 0);
    };
    BABYLON.Particle.prototype.lifeTime = 1.0;
    BABYLON.Particle.prototype.age = 0;
    BABYLON.Particle.prototype.size = 0;
    BABYLON.Particle.prototype.angle = 0;
    BABYLON.Particle.prototype.angularSpeed = 0;
})();
var BABYLON = BABYLON || {};
(function () {
    var randomNumber = function (min, max) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    };
    BABYLON.ParticleSystem = function (name, capacity, scene) {
        this.name = name;
        this.id = name;
        this._capacity = capacity;
        this._scene = scene;
        scene.particleSystems.push(this);
        this.gravity = BABYLON.Vector3.Zero();
        this.direction1 = new BABYLON.Vector3(0, 1.0, 0);
        this.direction2 = new BABYLON.Vector3(0, 1.0, 0);
        this.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
        this.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);
        this.color1 = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
        this.color2 = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
        this.colorDead = new BABYLON.Color4(0, 0, 0, 1.0);
        this.textureMask = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
        this.particles = [];
        this._stockParticles = [];
        this._newPartsExcess = 0;
        this._vertexDeclaration = [3, 4, 4];
        this._vertexStrideSize = 11 * 4;
        this._vertexBuffer = scene.getEngine().createDynamicVertexBuffer(capacity * this._vertexStrideSize * 4);
        var indices = [];
        var index = 0;
        for (var count = 0; count < capacity; count++) {
            indices.push(index);
            indices.push(index + 1);
            indices.push(index + 2);
            indices.push(index);
            indices.push(index + 2);
            indices.push(index + 3);
            index += 4;
        }
        this._indexBuffer = scene.getEngine().createIndexBuffer(indices);
        this._vertices = new Float32Array(capacity * this._vertexStrideSize);
        this._scaledColorStep = new BABYLON.Color4(0, 0, 0, 0);
        this._colorDiff = new BABYLON.Color4(0, 0, 0, 0);
        this._scaledDirection = BABYLON.Vector3.Zero();
        this._scaledGravity = BABYLON.Vector3.Zero();
        this._currentRenderId = -1;
    };
    BABYLON.ParticleSystem.prototype.renderingGroupId = 0;
    BABYLON.ParticleSystem.prototype.emitter = null;
    BABYLON.ParticleSystem.prototype.emitRate = 10;
    BABYLON.ParticleSystem.prototype.manualEmitCount = -1;
    BABYLON.ParticleSystem.prototype.updateSpeed = 0.01;
    BABYLON.ParticleSystem.prototype.targetStopDuration = 0;
    BABYLON.ParticleSystem.prototype.disposeOnStop = false;
    BABYLON.ParticleSystem.prototype.minEmitPower = 1;
    BABYLON.ParticleSystem.prototype.maxEmitPower = 1;
    BABYLON.ParticleSystem.prototype.minLifeTime = 1;
    BABYLON.ParticleSystem.prototype.maxLifeTime = 1;
    BABYLON.ParticleSystem.prototype.minSize = 1;
    BABYLON.ParticleSystem.prototype.maxSize = 1;
    BABYLON.ParticleSystem.prototype.minAngularSpeed = 0;
    BABYLON.ParticleSystem.prototype.maxAngularSpeed = 0;
    BABYLON.ParticleSystem.prototype.particleTexture = null;
    BABYLON.ParticleSystem.prototype.onDispose = null;
    BABYLON.ParticleSystem.prototype.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    BABYLON.ParticleSystem.prototype.forceDepthWrite = false;
    BABYLON.ParticleSystem.prototype.isAlive = function () {
        return this._alive;
    };
    BABYLON.ParticleSystem.prototype.start = function () {
        this._started = true;
        this._stopped = false;
        this._actualFrame = 0;
    };
    BABYLON.ParticleSystem.prototype.stop = function () {
        this._stopped = true;
    };
    BABYLON.ParticleSystem.prototype._appendParticleVertex = function (index, particle, offsetX, offsetY) {
        var offset = index * 11;
        this._vertices[offset] = particle.position.x;
        this._vertices[offset + 1] = particle.position.y;
        this._vertices[offset + 2] = particle.position.z;
        this._vertices[offset + 3] = particle.color.r;
        this._vertices[offset + 4] = particle.color.g;
        this._vertices[offset + 5] = particle.color.b;
        this._vertices[offset + 6] = particle.color.a;
        this._vertices[offset + 7] = particle.angle;
        this._vertices[offset + 8] = particle.size;
        this._vertices[offset + 9] = offsetX;
        this._vertices[offset + 10] = offsetY;
    };
    BABYLON.ParticleSystem.prototype._update = function (newParticles) {
        this._alive = this.particles.length > 0;
        for (var index = 0; index < this.particles.length; index++) {
            var particle = this.particles[index];
            particle.age += this._scaledUpdateSpeed;
            if (particle.age >= particle.lifeTime) {
                this._stockParticles.push(this.particles.splice(index, 1)[0]);
                index--;
                continue;
            } else {
                particle.colorStep.scaleToRef(this._scaledUpdateSpeed, this._scaledColorStep);
                particle.color.addInPlace(this._scaledColorStep);
                if (particle.color.a < 0) particle.color.a = 0;
                particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
                particle.position.addInPlace(this._scaledDirection);
                particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;
                this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
                particle.direction.addInPlace(this._scaledGravity);
            }
        }
        var worldMatrix;
        if (this.emitter.position) {
            worldMatrix = this.emitter.getWorldMatrix();
        } else {
            worldMatrix = BABYLON.Matrix.Translation(this.emitter.x, this.emitter.y, this.emitter.z);
        }
        for (var index = 0; index < newParticles; index++) {
            if (this.particles.length == this._capacity) {
                break;
            }
            if (this._stockParticles.length !== 0) {
                particle = this._stockParticles.pop();
                particle.age = 0;
            } else {
                particle = new BABYLON.Particle();
            }
            this.particles.push(particle);
            var emitPower = randomNumber(this.minEmitPower, this.maxEmitPower);
            var randX = randomNumber(this.direction1.x, this.direction2.x);
            var randY = randomNumber(this.direction1.y, this.direction2.y);
            var randZ = randomNumber(this.direction1.z, this.direction2.z);
            BABYLON.Vector3.TransformNormalFromFloatsToRef(randX * emitPower, randY * emitPower, randZ * emitPower, worldMatrix, particle.direction);
            particle.lifeTime = randomNumber(this.minLifeTime, this.maxLifeTime);
            particle.size = randomNumber(this.minSize, this.maxSize);
            particle.angularSpeed = randomNumber(this.minAngularSpeed, this.maxAngularSpeed);
            randX = randomNumber(this.minEmitBox.x, this.maxEmitBox.x);
            randY = randomNumber(this.minEmitBox.y, this.maxEmitBox.y);
            randZ = randomNumber(this.minEmitBox.z, this.maxEmitBox.z);
            BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, particle.position);
            var step = randomNumber(0, 1.0);
            BABYLON.Color4.LerpToRef(this.color1, this.color2, step, particle.color);
            this.colorDead.subtractToRef(particle.color, this._colorDiff);
            this._colorDiff.scaleToRef(1.0 / particle.lifeTime, particle.colorStep);
        }
    };
    BABYLON.ParticleSystem.prototype._getEffect = function () {
        var defines = [];
        if (BABYLON.clipPlane) {
            defines.push("#define CLIPPLANE");
        }
        var join = defines.join("\n");
        if (this._cachedDefines != join) {
            this._cachedDefines = join;
            this._effect = this._scene.getEngine().createEffect("particles", ["position", "color", "options"], ["invView", "view", "projection", "vClipPlane", "textureMask"], ["diffuseSampler"], join);
        }
        return this._effect;
    };
    BABYLON.ParticleSystem.prototype.animate = function () {
        if (!this._started) return;
        var effect = this._getEffect();
        if (!this.emitter || !effect.isReady() || !this.particleTexture || !this.particleTexture.isReady()) return;
        if (this._currentRenderId === this._scene.getRenderId()) {
            return;
        }
        this._currentRenderId = this._scene.getRenderId();
        this._scaledUpdateSpeed = this.updateSpeed * this._scene.getAnimationRatio();
        var emitCout;
        if (this.manualEmitCount > -1) {
            emitCout = this.manualEmitCount;
            this.manualEmitCount = 0;
        } else {
            emitCout = this.emitRate;
        }
        var newParticles = ((emitCout * this._scaledUpdateSpeed) >> 0);
        this._newPartsExcess += emitCout * this._scaledUpdateSpeed - newParticles;
        if (this._newPartsExcess > 1.0) {
            newParticles += this._newPartsExcess >> 0;
            this._newPartsExcess -= this._newPartsExcess >> 0;
        }
        this._alive = false;
        if (!this._stopped) {
            this._actualFrame += this._scaledUpdateSpeed;
            if (this.targetStopDuration && this._actualFrame >= this.targetStopDuration) this.stop();
        } else {
            newParticles = 0;
        }
        this._update(newParticles);
        if (this._stopped) {
            if (!this._alive) {
                this._started = false;
                if (this.disposeOnStop) {
                    this._scene._toBeDisposed.push(this);
                }
            }
        }
        var offset = 0;
        for (var index = 0; index < this.particles.length; index++) {
            var particle = this.particles[index];
            this._appendParticleVertex(offset++, particle, 0, 0);
            this._appendParticleVertex(offset++, particle, 1, 0);
            this._appendParticleVertex(offset++, particle, 1, 1);
            this._appendParticleVertex(offset++, particle, 0, 1);
        }
        var engine = this._scene.getEngine();
        engine.updateDynamicVertexBuffer(this._vertexBuffer, this._vertices, this.particles.length * this._vertexStrideSize);
    };
    BABYLON.ParticleSystem.prototype.render = function () {
        var effect = this._getEffect();
        if (!this.emitter || !effect.isReady() || !this.particleTexture || !this.particleTexture.isReady() || !this.particles.length) return 0;
        var engine = this._scene.getEngine();
        engine.enableEffect(effect);
        var viewMatrix = this._scene.getViewMatrix();
        effect.setTexture("diffuseSampler", this.particleTexture);
        effect.setMatrix("view", viewMatrix);
        effect.setMatrix("projection", this._scene.getProjectionMatrix());
        effect.setFloat4("textureMask", this.textureMask.r, this.textureMask.g, this.textureMask.b, this.textureMask.a);
        if (BABYLON.clipPlane) {
            var invView = viewMatrix.clone();
            invView.invert();
            effect.setMatrix("invView", invView);
            effect.setFloat4("vClipPlane", BABYLON.clipPlane.normal.x, BABYLON.clipPlane.normal.y, BABYLON.clipPlane.normal.z, BABYLON.clipPlane.d);
        }
        engine.bindBuffers(this._vertexBuffer, this._indexBuffer, this._vertexDeclaration, this._vertexStrideSize, effect);
        if (this.blendMode === BABYLON.ParticleSystem.BLENDMODE_ONEONE) {
            engine.setAlphaMode(BABYLON.Engine.ALPHA_ADD);
        } else {
            engine.setAlphaMode(BABYLON.Engine.ALPHA_COMBINE);
        } if (this.forceDepthWrite) {
            this.setDepthWrite(true);
        }
        engine.draw(true, 0, this.particles.length * 6);
        engine.setAlphaMode(BABYLON.Engine.ALPHA_DISABLE);
        return this.particles.length;
    };
    BABYLON.ParticleSystem.prototype.dispose = function () {
        if (this._vertexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._vertexBuffer);
            this._vertexBuffer = null;
        }
        if (this._indexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }
        if (this.particleTexture) {
            this.particleTexture.dispose();
            this.particleTexture = null;
        }
        var index = this._scene.particleSystems.indexOf(this);
        this._scene.particleSystems.splice(index, 1);
        if (this.onDispose) {
            this.onDispose();
        }
    };
    BABYLON.ParticleSystem.prototype.clone = function (name, newEmitter) {
        var result = new BABYLON.ParticleSystem(name, this._capacity, this._scene);
        BABYLON.Tools.DeepCopy(this, result, ["particles"], ["_vertexDeclaration", "_vertexStrideSize"]);
        if (newEmitter === undefined) {
            newEmitter = this.emitter;
        }
        result.emitter = newEmitter;
        if (this.particleTexture) {
            result.particleTexture = new BABYLON.Texture(this.particleTexture.name, this._scene);
        }
        result.start();
        return result;
    };
    BABYLON.ParticleSystem.BLENDMODE_ONEONE = 0;
    BABYLON.ParticleSystem.BLENDMODE_STANDARD = 1;
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Animation = function (name, targetProperty, framePerSecond, dataType, loopMode) {
        this.name = name;
        this.targetProperty = targetProperty;
        this.targetPropertyPath = targetProperty.split(".");
        this.framePerSecond = framePerSecond;
        this.dataType = dataType;
        this.loopMode = loopMode === undefined ? BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE : loopMode;
        this._keys = [];
        this._offsetsCache = {};
        this._highLimitsCache = {};
    };
    BABYLON.Animation.prototype.floatInterpolateFunction = function (startValue, endValue, gradient) {
        return startValue + (endValue - startValue) * gradient;
    };
    BABYLON.Animation.prototype.quaternionInterpolateFunction = function (startValue, endValue, gradient) {
        return BABYLON.Quaternion.Slerp(startValue, endValue, gradient);
    };
    BABYLON.Animation.prototype.vector3InterpolateFunction = function (startValue, endValue, gradient) {
        return BABYLON.Vector3.Lerp(startValue, endValue, gradient);
    };
    BABYLON.Animation.prototype.clone = function () {
        var clone = new BABYLON.Animation(this.name, this.targetPropertyPath.join("."), this.framePerSecond, this.dataType, this.loopMode);
        clone.setKeys(this._keys);
        return clone;
    };
    BABYLON.Animation.prototype.setKeys = function (values) {
        this._keys = values.slice(0);
        this._offsetsCache = {};
        this._highLimitsCache = {};
    };
    BABYLON.Animation.prototype._interpolate = function (currentFrame, repeatCount, loopMode, offsetValue, highLimitValue) {
        if (loopMode === BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT && repeatCount > 0) {
            return highLimitValue.clone ? highLimitValue.clone() : highLimitValue;
        }
        this.currentFrame = currentFrame;
        for (var key = 0; key < this._keys.length; key++) {
            if (this._keys[key + 1].frame >= currentFrame) {
                var startValue = this._keys[key].value;
                var endValue = this._keys[key + 1].value;
                var gradient = (currentFrame - this._keys[key].frame) / (this._keys[key + 1].frame - this._keys[key].frame);
                switch (this.dataType) {
                case BABYLON.Animation.ANIMATIONTYPE_FLOAT:
                    switch (loopMode) {
                    case BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE:
                    case BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT:
                        return this.floatInterpolateFunction(startValue, endValue, gradient);
                    case BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE:
                        return offsetValue * repeatCount + this.floatInterpolateFunction(startValue, endValue, gradient);
                    }
                    break;
                case BABYLON.Animation.ANIMATIONTYPE_QUATERNION:
                    var quaternion = null;
                    switch (loopMode) {
                    case BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE:
                    case BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT:
                        quaternion = this.quaternionInterpolateFunction(startValue, endValue, gradient);
                        break;
                    case BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE:
                        quaternion = this.quaternionInterpolateFunction(startValue, endValue, gradient).add(offsetValue.scale(repeatCount));
                        break;
                    }
                    return quaternion;
                case BABYLON.Animation.ANIMATIONTYPE_VECTOR3:
                    switch (loopMode) {
                    case BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE:
                    case BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT:
                        return this.vector3InterpolateFunction(startValue, endValue, gradient);
                    case BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE:
                        return this.vector3InterpolateFunction(startValue, endValue, gradient).add(offsetValue.scale(repeatCount));
                    }
                case BABYLON.Animation.ANIMATIONTYPE_MATRIX:
                    switch (loopMode) {
                    case BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE:
                    case BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT:
                    case BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE:
                        return startValue;
                    }
                default:
                    break;
                }
                break;
            }
        }
        return this._keys[this._keys.length - 1].value;
    };
    BABYLON.Animation.prototype.animate = function (target, delay, from, to, loop, speedRatio) {
        if (!this.targetPropertyPath || this.targetPropertyPath.length < 1) {
            return false;
        }
        var returnValue = true;
        if (this._keys[0].frame != 0) {
            var newKey = {
                frame: 0,
                value: this._keys[0].value
            };
            this._keys.splice(0, 0, newKey);
        }
        if (from < this._keys[0].frame || from > this._keys[this._keys.length - 1].frame) {
            from = this._keys[0].frame;
        }
        if (to < this._keys[0].frame || to > this._keys[this._keys.length - 1].frame) {
            to = this._keys[this._keys.length - 1].frame;
        }
        var range = to - from;
        var ratio = delay * (this.framePerSecond * speedRatio) / 1000.0;
        if (ratio > range && !loop) {
            offsetValue = 0;
            returnValue = false;
        } else {
            var offsetValue = 0;
            var highLimitValue = 0;
            if (this.loopMode != BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE) {
                var keyOffset = to.toString() + from.toString();
                if (!this._offsetsCache[keyOffset]) {
                    var fromValue = this._interpolate(from, 0, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                    var toValue = this._interpolate(to, 0, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                    switch (this.dataType) {
                    case BABYLON.Animation.ANIMATIONTYPE_FLOAT:
                        this._offsetsCache[keyOffset] = toValue - fromValue;
                        break;
                    case BABYLON.Animation.ANIMATIONTYPE_QUATERNION:
                        this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                        break;
                    case BABYLON.Animation.ANIMATIONTYPE_VECTOR3:
                        this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
                    default:
                        break;
                    }
                    this._highLimitsCache[keyOffset] = toValue;
                }
                highLimitValue = this._highLimitsCache[keyOffset];
                offsetValue = this._offsetsCache[keyOffset];
            }
        }
        var repeatCount = (ratio / range) >> 0;
        var currentFrame = returnValue ? from + ratio % range : to;
        var currentValue = this._interpolate(currentFrame, repeatCount, this.loopMode, offsetValue, highLimitValue);
        if (this.targetPropertyPath.length > 1) {
            var property = target[this.targetPropertyPath[0]];
            for (var index = 1; index < this.targetPropertyPath.length - 1; index++) {
                property = property[this.targetPropertyPath[index]];
            }
            property[this.targetPropertyPath[this.targetPropertyPath.length - 1]] = currentValue;
        } else {
            target[this.targetPropertyPath[0]] = currentValue;
        } if (target.markAsDirty) {
            target.markAsDirty(this.targetProperty);
        }
        return returnValue;
    };
    BABYLON.Animation.ANIMATIONTYPE_FLOAT = 0;
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3 = 1;
    BABYLON.Animation.ANIMATIONTYPE_QUATERNION = 2;
    BABYLON.Animation.ANIMATIONTYPE_MATRIX = 3;
    BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE = 0;
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE = 1;
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT = 2;
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON._Animatable = function (target, from, to, loop, speedRatio, onAnimationEnd) {
        this.target = target;
        this.fromFrame = from;
        this.toFrame = to;
        this.loopAnimation = loop;
        this.speedRatio = speedRatio ? speedRatio : 1.0;
        this.onAnimationEnd = onAnimationEnd;
    };
    BABYLON._Animatable.prototype.target = null;
    BABYLON._Animatable.prototype.animationStarted = false;
    BABYLON._Animatable.prototype.loopAnimation = false;
    BABYLON._Animatable.prototype.fromFrame = 0;
    BABYLON._Animatable.prototype.toFrame = 100;
    BABYLON._Animatable.prototype.speedRatio = 1.0;
    BABYLON._Animatable.prototype._animate = function (delay) {
        if (!this._localDelayOffset) {
            this._localDelayOffset = delay;
        }
        var running = false;
        var animations = this.target.animations;
        for (var index = 0; index < animations.length; index++) {
            var isRunning = animations[index].animate(this.target, delay - this._localDelayOffset, this.fromFrame, this.toFrame, this.loopAnimation, this.speedRatio);
            running = running || isRunning;
        }
        if (!running && this.onAnimationEnd) {
            this.onAnimationEnd();
        }
        return running;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Octree = function (maxBlockCapacity) {
        this.blocks = [];
        this._maxBlockCapacity = maxBlockCapacity || 64;
        this._selection = new BABYLON.Tools.SmartArray(256);
    };
    BABYLON.Octree.prototype.update = function (worldMin, worldMax, meshes) {
        BABYLON.Octree._CreateBlocks(worldMin, worldMax, meshes, this._maxBlockCapacity, this);
    };
    BABYLON.Octree.prototype.addMesh = function (mesh) {
        for (var index = 0; index < this.blocks.length; index++) {
            var block = this.blocks[index];
            block.addMesh(mesh);
        }
    };
    BABYLON.Octree.prototype.select = function (frustumPlanes) {
        this._selection.reset();
        for (var index = 0; index < this.blocks.length; index++) {
            var block = this.blocks[index];
            block.select(frustumPlanes, this._selection);
        }
        return this._selection;
    };
    BABYLON.Octree._CreateBlocks = function (worldMin, worldMax, meshes, maxBlockCapacity, target) {
        target.blocks = [];
        var blockSize = new BABYLON.Vector3((worldMax.x - worldMin.x) / 2, (worldMax.y - worldMin.y) / 2, (worldMax.z - worldMin.z) / 2);
        for (var x = 0; x < 2; x++) {
            for (var y = 0; y < 2; y++) {
                for (var z = 0; z < 2; z++) {
                    var localMin = worldMin.add(blockSize.multiplyByFloats(x, y, z));
                    var localMax = worldMin.add(blockSize.multiplyByFloats(x + 1, y + 1, z + 1));
                    var block = new BABYLON.OctreeBlock(localMin, localMax, maxBlockCapacity);
                    block.addEntries(meshes);
                    target.blocks.push(block);
                }
            }
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.OctreeBlock = function (minPoint, maxPoint, capacity) {
        this.subMeshes = [];
        this.meshes = [];
        this._capacity = capacity;
        this._minPoint = minPoint;
        this._maxPoint = maxPoint;
        this._boundingVectors = [];
        this._boundingVectors.push(minPoint.clone());
        this._boundingVectors.push(maxPoint.clone());
        this._boundingVectors.push(minPoint.clone());
        this._boundingVectors[2].x = maxPoint.x;
        this._boundingVectors.push(minPoint.clone());
        this._boundingVectors[3].y = maxPoint.y;
        this._boundingVectors.push(minPoint.clone());
        this._boundingVectors[4].z = maxPoint.z;
        this._boundingVectors.push(maxPoint.clone());
        this._boundingVectors[5].z = minPoint.z;
        this._boundingVectors.push(maxPoint.clone());
        this._boundingVectors[6].x = minPoint.x;
        this._boundingVectors.push(maxPoint.clone());
        this._boundingVectors[7].y = minPoint.y;
    };
    BABYLON.OctreeBlock.prototype.addMesh = function (mesh) {
        if (this.blocks) {
            for (var index = 0; index < this.blocks.length; index++) {
                var block = this.blocks[index];
                block.addMesh(mesh);
            }
            return;
        }
        if (mesh.getBoundingInfo().boundingBox.intersectsMinMax(this._minPoint, this._maxPoint)) {
            var localMeshIndex = this.meshes.length;
            this.meshes.push(mesh);
            this.subMeshes[localMeshIndex] = [];
            for (var subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
                var subMesh = mesh.subMeshes[subIndex];
                if (mesh.subMeshes.length === 1 || subMesh.getBoundingInfo().boundingBox.intersectsMinMax(this._minPoint, this._maxPoint)) {
                    this.subMeshes[localMeshIndex].push(subMesh);
                }
            }
        }
        if (this.subMeshes.length > this._capacity) {
            BABYLON.Octree._CreateBlocks(this._minPoint, this._maxPoint, this.meshes, this._capacity, this);
        }
    };
    BABYLON.OctreeBlock.prototype.addEntries = function (meshes) {
        for (var index = 0; index < meshes.length; index++) {
            var mesh = meshes[index];
            this.addMesh(mesh);
        }
    };
    BABYLON.OctreeBlock.prototype.select = function (frustumPlanes, selection) {
        if (this.blocks) {
            for (var index = 0; index < this.blocks.length; index++) {
                var block = this.blocks[index];
                block.select(frustumPlanes, selection);
            }
            return;
        }
        if (BABYLON.BoundingBox.IsInFrustum(this._boundingVectors, frustumPlanes)) {
            selection.push(this);
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Bone = function (name, skeleton, parentBone, matrix) {
        this.name = name;
        this._skeleton = skeleton;
        this._matrix = matrix;
        this._baseMatrix = matrix;
        this._worldTransform = new BABYLON.Matrix();
        this._absoluteTransform = new BABYLON.Matrix();
        this._invertedAbsoluteTransform = new BABYLON.Matrix();
        this.children = [];
        this.animations = [];
        skeleton.bones.push(this);
        if (parentBone) {
            this._parent = parentBone;
            parentBone.children.push(this);
        } else {
            this._parent = null;
        }
        this._updateDifferenceMatrix();
    };
    BABYLON.Bone.prototype.getParent = function () {
        return this._parent;
    };
    BABYLON.Bone.prototype.getLocalMatrix = function () {
        return this._matrix;
    };
    BABYLON.Bone.prototype.getAbsoluteMatrix = function () {
        var matrix = this._matrix.clone();
        var parent = this._parent;
        while (parent) {
            matrix = matrix.multiply(parent.getLocalMatrix());
            parent = parent.getParent();
        }
        return matrix;
    };
    BABYLON.Bone.prototype.updateMatrix = function (matrix) {
        this._matrix = matrix;
        this._skeleton._markAsDirty();
        this._updateDifferenceMatrix();
    };
    BABYLON.Bone.prototype._updateDifferenceMatrix = function () {
        if (this._parent) {
            this._matrix.multiplyToRef(this._parent._absoluteTransform, this._absoluteTransform);
        } else {
            this._absoluteTransform.copyFrom(this._matrix);
        }
        this._absoluteTransform.invertToRef(this._invertedAbsoluteTransform);
        for (var index = 0; index < this.children.length; index++) {
            this.children[index]._updateDifferenceMatrix();
        }
    };
    BABYLON.Bone.prototype.markAsDirty = function () {
        this._skeleton._markAsDirty();
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Skeleton = function (name, id, scene) {
        this.id = id;
        this.name = name;
        this.bones = [];
        this._scene = scene;
        scene.skeletons.push(this);
        this._isDirty = true;
    };
    BABYLON.Skeleton.prototype.getTransformMatrices = function () {
        return this._transformMatrices;
    };
    BABYLON.Skeleton.prototype._markAsDirty = function () {
        this._isDirty = true;
    };
    BABYLON.Skeleton.prototype.prepare = function () {
        if (!this._isDirty) {
            return;
        }
        if (!this._transformMatrices || this._transformMatrices.length !== 16 * this.bones.length) {
            this._transformMatrices = new BABYLON.MatrixType(16 * this.bones.length);
        }
        for (var index = 0; index < this.bones.length; index++) {
            var bone = this.bones[index];
            var parentBone = bone.getParent();
            if (parentBone) {
                bone._matrix.multiplyToRef(parentBone._worldTransform, bone._worldTransform);
            } else {
                bone._worldTransform.copyFrom(bone._matrix);
            }
            bone._invertedAbsoluteTransform.multiplyToArray(bone._worldTransform, this._transformMatrices, index * 16);
        }
        this._isDirty = false;
    };
    BABYLON.Skeleton.prototype.getAnimatables = function () {
        if (!this._animatables || this._animatables.length != this.bones.length) {
            this._animatables = [];
            for (var index = 0; index < this.bones.length; index++) {
                this._animatables.push(this.bones[index]);
            }
        }
        return this._animatables;
    };
    BABYLON.Skeleton.prototype.clone = function (name, id) {
        var result = new BABYLON.Skeleton(name, id || name, this._scene);
        for (var index = 0; index < this.bones.length; index++) {
            var source = this.bones[index];
            var parentBone = null;
            if (source.getParent()) {
                var parentIndex = this.bones.indexOf(source.getParent());
                parentBone = result.bones[parentIndex];
            }
            var bone = new BABYLON.Bone(source.name, result, parentBone, source._baseMatrix);
            BABYLON.Tools.DeepCopy(source.animations, bone.animations);
        }
        return result;
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.PostProcess = function (name, fragmentUrl, parameters, samplers, ratio, camera, samplingMode, engine, reusable) {
        this.name = name;
        if (camera != null) {
            this._camera = camera;
            this._scene = camera.getScene();
            camera.attachPostProcess(this);
            this._engine = this._scene.getEngine();
        } else {
            this._engine = engine;
        }
        this._renderRatio = ratio;
        this.width = -1;
        this.height = -1;
        this.renderTargetSamplingMode = samplingMode ? samplingMode : BABYLON.Texture.NEAREST_SAMPLINGMODE;
        this._reusable = reusable || false;
        this._textures = new BABYLON.Tools.SmartArray(2);
        this._currentRenderTextureInd = 0;
        samplers = samplers || [];
        samplers.push("textureSampler");
        this._effect = this._engine.createEffect({
            vertex: "postprocess",
            fragment: fragmentUrl
        }, ["position"], parameters || [], samplers, "");
    };
    BABYLON.PostProcess.prototype.onApply = null;
    BABYLON.PostProcess.prototype._onDispose = null;
    BABYLON.PostProcess.prototype.onSizeChanged = null;
    BABYLON.PostProcess.prototype.onActivate = null;
    BABYLON.PostProcess.prototype.activate = function (camera) {
        camera = camera || this._camera;
        var scene = camera.getScene();
        var desiredWidth = this._engine._renderingCanvas.width * this._renderRatio;
        var desiredHeight = this._engine._renderingCanvas.height * this._renderRatio;
        if (this.width !== desiredWidth || this.height !== desiredHeight) {
            if (this._textures.length > 0) {
                for (var i = 0; i < this._textures.length; i++) {
                    this._engine._releaseTexture(this._textures.data[i]);
                }
                this._textures.reset();
            }
            this.width = desiredWidth;
            this.height = desiredHeight;
            this._textures.push(this._engine.createRenderTargetTexture({
                width: this.width,
                height: this.height
            }, {
                generateMipMaps: false,
                generateDepthBuffer: camera._postProcesses.indexOf(this) === camera._postProcessesTakenIndices[0],
                samplingMode: this.renderTargetSamplingMode
            }));
            if (this._reusable) {
                this._textures.push(this._engine.createRenderTargetTexture({
                    width: this.width,
                    height: this.height
                }, {
                    generateMipMaps: false,
                    generateDepthBuffer: camera._postProcesses.indexOf(this) === camera._postProcessesTakenIndices[0],
                    samplingMode: this.renderTargetSamplingMode
                }));
            }
            if (this.onSizeChanged) {
                this.onSizeChanged();
            }
        }
        this._engine.bindFramebuffer(this._textures.data[this._currentRenderTextureInd]);
        if (this.onActivate) {
            this.onActivate(camera);
        }
        this._engine.clear(scene.clearColor, scene.autoClear || scene.forceWireframe, true);
        if (this._reusable) {
            this._currentRenderTextureInd = (this._currentRenderTextureInd + 1) % 2;
        }
    };
    BABYLON.PostProcess.prototype.apply = function () {
        if (!this._effect.isReady()) return null;
        this._engine.enableEffect(this._effect);
        this._engine.setState(false);
        this._engine.setAlphaMode(BABYLON.Engine.ALPHA_DISABLE);
        this._engine.setDepthBuffer(false);
        this._engine.setDepthWrite(false);
        this._effect._bindTexture("textureSampler", this._textures.data[this._currentRenderTextureInd]);
        if (this.onApply) {
            this.onApply(this._effect);
        }
        return this._effect;
    };
    BABYLON.PostProcess.prototype.dispose = function (camera) {
        camera = camera || this._camera;
        if (this._onDispose) {
            this._onDispose();
        }
        if (this._textures.length > 0) {
            for (var i = 0; i < this._textures.length; i++) {
                this._engine._releaseTexture(this._textures.data[i]);
            }
            this._textures.reset();
        }
        camera.detachPostProcess(this);
        var index = camera._postProcesses.indexOf(this);
        if (index === camera._postProcessesTakenIndices[0] && camera._postProcessesTakenIndices.length > 0) {
            this._camera._postProcesses[camera._postProcessesTakenIndices[0]].width = -1;
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.PostProcessManager = function (scene) {
        this._scene = scene;
        var vertices = [];
        vertices.push(1, 1);
        vertices.push(-1, 1);
        vertices.push(-1, -1);
        vertices.push(1, -1);
        this._vertexDeclaration = [2];
        this._vertexStrideSize = 2 * 4;
        this._vertexBuffer = scene.getEngine().createVertexBuffer(vertices);
        var indices = [];
        indices.push(0);
        indices.push(1);
        indices.push(2);
        indices.push(0);
        indices.push(2);
        indices.push(3);
        this._indexBuffer = scene.getEngine().createIndexBuffer(indices);
    };
    BABYLON.PostProcessManager.prototype._prepareFrame = function () {
        var postProcesses = this._scene.activeCamera._postProcesses;
        var postProcessesTakenIndices = this._scene.activeCamera._postProcessesTakenIndices;
        if (postProcessesTakenIndices.length === 0 || !this._scene.postProcessesEnabled) {
            return;
        }
        postProcesses[this._scene.activeCamera._postProcessesTakenIndices[0]].activate(this._scene.activeCamera);
    };
    BABYLON.PostProcessManager.prototype._finalizeFrame = function () {
        var postProcesses = this._scene.activeCamera._postProcesses;
        var postProcessesTakenIndices = this._scene.activeCamera._postProcessesTakenIndices;
        if (postProcessesTakenIndices.length === 0 || !this._scene.postProcessesEnabled) {
            return;
        }
        var engine = this._scene.getEngine();
        for (var index = 0; index < postProcessesTakenIndices.length; index++) {
            if (index < postProcessesTakenIndices.length - 1) {
                postProcesses[postProcessesTakenIndices[index + 1]].activate(this._scene.activeCamera);
            } else {
                engine.restoreDefaultFramebuffer();
            }
            var effect = postProcesses[postProcessesTakenIndices[index]].apply();
            if (effect) {
                engine.bindBuffers(this._vertexBuffer, this._indexBuffer, this._vertexDeclaration, this._vertexStrideSize, effect);
                engine.draw(true, 0, 6);
            }
        }
        engine.setDepthBuffer(true);
        engine.setDepthWrite(true);
    };
    BABYLON.PostProcessManager.prototype.dispose = function () {
        if (this._vertexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._vertexBuffer);
            this._vertexBuffer = null;
        }
        if (this._indexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.PassPostProcess = function (name, ratio, camera, samplingMode, engine, reusable) {
        BABYLON.PostProcess.call(this, name, "pass", null, null, ratio, camera, samplingMode, engine, reusable);
    };
    BABYLON.PassPostProcess.prototype = Object.create(BABYLON.PostProcess.prototype);
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.BlurPostProcess = function (name, direction, blurWidth, ratio, camera, samplingMode, engine, reusable) {
        if (samplingMode === undefined) {
            samplingMode = BABYLON.Texture.BILINEAR_SAMPLINGMODE;
        }
        BABYLON.PostProcess.call(this, name, "blur", ["screenSize", "direction", "blurWidth"], null, ratio, camera, samplingMode, engine, reusable);
        this.direction = direction;
        this.blurWidth = blurWidth;
        var that = this;
        this.onApply = function (effect) {
            effect.setFloat2("screenSize", that.width, that.height);
            effect.setVector2("direction", that.direction);
            effect.setFloat("blurWidth", that.blurWidth);
        };
    };
    BABYLON.BlurPostProcess.prototype = Object.create(BABYLON.PostProcess.prototype);
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.FilterPostProcess = function (name, kernelMatrix, ratio, camera, samplingMode, engine, reusable) {
        BABYLON.PostProcess.call(this, name, "filter", ["kernelMatrix"], null, ratio, camera, samplingMode, engine, reusable);
        this.kernelMatrix = kernelMatrix;
        var that = this;
        this.onApply = function (effect) {
            effect.setMatrix("kernelMatrix", that.kernelMatrix);
        };
    };
    BABYLON.FilterPostProcess.prototype = Object.create(BABYLON.PostProcess.prototype);
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.RefractionPostProcess = function (name, refractionTextureUrl, color, depth, colorLevel, ratio, camera, samplingMode, engine, reusable) {
        BABYLON.PostProcess.call(this, name, "refraction", ["baseColor", "depth", "colorLevel"], ["refractionSampler"], ratio, camera, samplingMode, engine, reusable);
        this.color = color;
        this.depth = depth;
        this.colorLevel = colorLevel;
        this._refRexture = null;
        var that = this;
        this.onActivate = function (camera) {
            that._refRexture = this._refRexture || new BABYLON.Texture(refractionTextureUrl, camera.getScene());
        };
        this.onApply = function (effect) {
            effect.setColor3("baseColor", that.color);
            effect.setFloat("depth", that.depth);
            effect.setFloat("colorLevel", that.colorLevel);
            effect.setTexture("refractionSampler", that._refRexture);
        };
    };
    BABYLON.RefractionPostProcess.prototype = Object.create(BABYLON.PostProcess.prototype);
    BABYLON.RefractionPostProcess.prototype._onDispose = function () {
        if (this._refRexture) {
            this._refRexture.dispose();
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.BlackAndWhitePostProcess = function (name, ratio, camera, samplingMode, engine, reusable) {
        BABYLON.PostProcess.call(this, name, "blackAndWhite", null, null, ratio, camera, samplingMode, engine, reusable);
    };
    BABYLON.BlackAndWhitePostProcess.prototype = Object.create(BABYLON.PostProcess.prototype);
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.ConvolutionPostProcess = function (name, kernel, ratio, camera, samplingMode, engine, reusable) {
        BABYLON.PostProcess.call(this, name, "convolution", ["kernel", "screenSize"], null, ratio, camera, samplingMode, engine, reusable);
        this.kernel = kernel;
        var that = this;
        this.onApply = function (effect) {
            effect.setFloat2("screenSize", that.width, that.height);
            effect.setArray("kernel", that.kernel);
        };
    };
    BABYLON.ConvolutionPostProcess.prototype = Object.create(BABYLON.PostProcess.prototype);
    BABYLON.ConvolutionPostProcess.EdgeDetect0Kernel = [1, 0, -1, 0, 0, 0, -1, 0, 1];
    BABYLON.ConvolutionPostProcess.EdgeDetect1Kernel = [0, 1, 0, 1, -4, 1, 0, 1, 0];
    BABYLON.ConvolutionPostProcess.EdgeDetect2Kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
    BABYLON.ConvolutionPostProcess.SharpenKernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    BABYLON.ConvolutionPostProcess.EmbossKernel = [-2, -1, 0, -1, 1, 1, 0, 1, 2];
    BABYLON.ConvolutionPostProcess.GaussianKernel = [0, 1, 0, 1, 1, 1, 0, 1, 0];
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.FxaaPostProcess = function (name, ratio, camera, samplingMode, engine, reusable) {
        BABYLON.PostProcess.call(this, name, "fxaa", ["texelSize"], null, ratio, camera, samplingMode, engine, reusable);
    };
    BABYLON.FxaaPostProcess.prototype = Object.create(BABYLON.PostProcess.prototype);
    BABYLON.FxaaPostProcess.prototype.onSizeChanged = function () {
        this.texelWidth = 1.0 / this.width;
        this.texelHeight = 1.0 / this.height;
    };
    BABYLON.FxaaPostProcess.prototype.onApply = function (effect) {
        effect.setFloat2("texelSize", this.texelWidth, this.texelHeight);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.LensFlare = function (size, position, color, imgUrl, system) {
        this.color = color || new BABYLON.Color3(1, 1, 1);
        this.position = position;
        this.size = size;
        this.texture = imgUrl ? new BABYLON.Texture(imgUrl, system.getScene(), true) : null;
        this._system = system;
        system.lensFlares.push(this);
    };
    BABYLON.LensFlare.prototype.position = 0;
    BABYLON.LensFlare.prototype.size = 1.0;
    BABYLON.LensFlare.prototype.texture = null;
    BABYLON.LensFlare.prototype.dispose = function () {
        if (this.texture) {
            this.texture.dispose();
        }
        var index = this._system.lensFlares.indexOf(this);
        this._system.lensFlares.splice(index, 1);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.LensFlareSystem = function (name, emitter, scene) {
        this.lensFlares = [];
        this._scene = scene;
        this._emitter = emitter;
        this.name = name;
        scene.lensFlareSystems.push(this);
        this.meshesSelectionPredicate = function (m) {
            return m.material && m.isVisible && m.isEnabled() && m.checkCollisions;
        };
        var vertices = [];
        vertices.push(1, 1);
        vertices.push(-1, 1);
        vertices.push(-1, -1);
        vertices.push(1, -1);
        this._vertexDeclaration = [2];
        this._vertexStrideSize = 2 * 4;
        this._vertexBuffer = scene.getEngine().createVertexBuffer(vertices);
        var indices = [];
        indices.push(0);
        indices.push(1);
        indices.push(2);
        indices.push(0);
        indices.push(2);
        indices.push(3);
        this._indexBuffer = scene.getEngine().createIndexBuffer(indices);
        this._effect = this._scene.getEngine().createEffect("lensFlare", ["position"], ["color", "viewportMatrix"], ["textureSampler"], "");
    };
    BABYLON.LensFlareSystem.prototype.borderLimit = 300;
    BABYLON.LensFlareSystem.prototype.getScene = function () {
        return this._scene;
    };
    BABYLON.LensFlareSystem.prototype.getEmitterPosition = function () {
        return this._emitter.getAbsolutePosition ? this._emitter.getAbsolutePosition() : this._emitter.position;
    };
    BABYLON.LensFlareSystem.prototype.computeEffectivePosition = function (globalViewport) {
        var position = this.getEmitterPosition();
        position = BABYLON.Vector3.Project(position, BABYLON.Matrix.Identity(), this._scene.getTransformMatrix(), globalViewport);
        this._positionX = position.x;
        this._positionY = position.y;
        position = BABYLON.Vector3.TransformCoordinates(this.getEmitterPosition(), this._scene.getViewMatrix());
        if (position.z > 0) {
            if ((this._positionX > globalViewport.x) && (this._positionX < globalViewport.x + globalViewport.width)) {
                if ((this._positionY > globalViewport.y) && (this._positionY < globalViewport.y + globalViewport.height)) return true;
            }
        }
        return false;
    };
    BABYLON.LensFlareSystem.prototype._isVisible = function () {
        var emitterPosition = this.getEmitterPosition();
        var direction = emitterPosition.subtract(this._scene.activeCamera.position);
        var distance = direction.length();
        direction.normalize();
        var ray = new BABYLON.Ray(this._scene.activeCamera.position, direction);
        var pickInfo = this._scene.pickWithRay(ray, this.meshesSelectionPredicate, true);
        return !pickInfo.hit || pickInfo.distance > distance;
    };
    BABYLON.LensFlareSystem.prototype.render = function () {
        if (!this._effect.isReady()) return false;
        var engine = this._scene.getEngine();
        var viewport = this._scene.activeCamera.viewport;
        var globalViewport = viewport.toGlobal(engine);
        if (!this.computeEffectivePosition(globalViewport)) {
            return false;
        }
        if (!this._isVisible()) {
            return false;
        }
        var awayX;
        var awayY;
        if (this._positionX < this.borderLimit + globalViewport.x) {
            awayX = this.borderLimit + globalViewport.x - this._positionX;
        } else if (this._positionX > globalViewport.x + globalViewport.width - this.borderLimit) {
            awayX = this._positionX - globalViewport.x - globalViewport.width + this.borderLimit;
        } else {
            awayX = 0;
        } if (this._positionY < this.borderLimit + globalViewport.y) {
            awayY = this.borderLimit + globalViewport.y - this._positionY;
        } else if (this._positionY > globalViewport.y + globalViewport.height - this.borderLimit) {
            awayY = this._positionY - globalViewport.y - globalViewport.height + this.borderLimit;
        } else {
            awayY = 0;
        }
        var away = (awayX > awayY) ? awayX : awayY;
        if (away > this.borderLimit) {
            away = this.borderLimit;
        }
        var intensity = 1.0 - (away / this.borderLimit);
        if (intensity < 0) {
            return false;
        }
        if (intensity > 1.0) {
            intensity = 1.0;
        }
        var centerX = globalViewport.x + globalViewport.width / 2;
        var centerY = globalViewport.y + globalViewport.height / 2;
        var distX = centerX - this._positionX;
        var distY = centerY - this._positionY;
        engine.enableEffect(this._effect);
        engine.setState(false);
        engine.setDepthBuffer(false);
        engine.setAlphaMode(BABYLON.Engine.ALPHA_ADD);
        engine.bindBuffers(this._vertexBuffer, this._indexBuffer, this._vertexDeclaration, this._vertexStrideSize, this._effect);
        for (var index = 0; index < this.lensFlares.length; index++) {
            var flare = this.lensFlares[index];
            var x = centerX - (distX * flare.position);
            var y = centerY - (distY * flare.position);
            var cw = flare.size;
            var ch = flare.size * engine.getAspectRatio(this._scene.activeCamera);
            var cx = 2 * (x / globalViewport.width) - 1.0;
            var cy = 1.0 - 2 * (y / globalViewport.height);
            var viewportMatrix = BABYLON.Matrix.FromValues(cw / 2, 0, 0, 0, 0, ch / 2, 0, 0, 0, 0, 1, 0, cx, cy, 0, 1);
            this._effect.setMatrix("viewportMatrix", viewportMatrix);
            this._effect.setTexture("textureSampler", flare.texture);
            this._effect.setFloat4("color", flare.color.r * intensity, flare.color.g * intensity, flare.color.b * intensity, 1.0);
            engine.draw(true, 0, 6);
        }
        engine.setDepthBuffer(true);
        engine.setAlphaMode(BABYLON.Engine.ALPHA_DISABLE);
        return true;
    };
    BABYLON.LensFlareSystem.prototype.dispose = function () {
        if (this._vertexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._vertexBuffer);
            this._vertexBuffer = null;
        }
        if (this._indexBuffer) {
            this._scene.getEngine()._releaseBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }
        while (this.lensFlares.length) {
            this.lensFlares[0].dispose();
        }
        var index = this._scene.lensFlareSystems.indexOf(this);
        this._scene.lensFlareSystems.splice(index, 1);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.PickingInfo = function () {};
    BABYLON.PickingInfo.prototype.hit = false;
    BABYLON.PickingInfo.prototype.distance = 0;
    BABYLON.PickingInfo.prototype.pickedPoint = null;
    BABYLON.PickingInfo.prototype.pickedMesh = null;
    BABYLON.PickingInfo.prototype.bu = 0;
    BABYLON.PickingInfo.prototype.bv = 0;
    BABYLON.PickingInfo.prototype.faceId = -1;
    BABYLON.PickingInfo.prototype.getNormal = function () {
        if (!this.pickedMesh) {
            return null;
        }
        var indices = this.pickedMesh.getIndices();
        var normals = this.pickedMesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        var normal0 = BABYLON.Vector3.FromArray(normals, indices[this.faceId]);
        var normal1 = BABYLON.Vector3.FromArray(normals, indices[this.faceId + 1]);
        var normal2 = BABYLON.Vector3.FromArray(normals, indices[this.faceId + 2]);
        normal0 = normal0.scale(this.bu);
        normal1 = normal1.scale(this.bv);
        normal2 = normal2.scale(1.0 - this.bu - this.bv);
        return new BABYLON.Vector3(normal0.x + normal1.x + normal2.x, normal0.y + normal1.y + normal2.y, normal0.z + normal1.z + normal2.z);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    var that;
    BABYLON.FilesInput = function (p_engine, p_scene, p_canvas, p_sceneLoadedCallback, p_progressCallback, p_additionnalRenderLoopLogicCallback, p_textureLoadingCallback, p_startingProcessingFilesCallback) {
        that = this;
        this.engine = p_engine;
        this.canvas = p_canvas;
        this.currentScene = p_scene;
        this.sceneLoadedCallback = p_sceneLoadedCallback;
        this.progressCallback = p_progressCallback;
        this.additionnalRenderLoopLogicCallback = p_additionnalRenderLoopLogicCallback;
        this.textureLoadingCallback = p_textureLoadingCallback;
        this.startingProcessingFilesCallback = p_startingProcessingFilesCallback;
        this.engine.runRenderLoop(renderFunction);
    };
    BABYLON.FilesInput.prototype.monitorElementForDragNDrop = function (p_elementToMonitor) {
        if (p_elementToMonitor) {
            this.elementToMonitor = p_elementToMonitor;
            this.elementToMonitor.addEventListener("dragenter", drag, false);
            this.elementToMonitor.addEventListener("dragover", drag, false);
            this.elementToMonitor.addEventListener("drop", drop, false);
        }
    };

    function renderFunction() {
        if (that.additionnalRenderLoopLogicCallback) {
            that.additionnalRenderLoopLogicCallback();
        }
        if (that.currentScene) {
            if (that.textureLoadingCallback) {
                var remaining = that.currentScene.getWaitingItemsCount();
                if (remaining > 0) {
                    that.textureLoadingCallback(remaining);
                }
            }
            that.currentScene.render();
        }
    };

    function drag(e) {
        e.stopPropagation();
        e.preventDefault();
    };

    function drop(eventDrop) {
        eventDrop.stopPropagation();
        eventDrop.preventDefault();
        that.loadFiles(eventDrop);
    };
    BABYLON.FilesInput.prototype.loadFiles = function (event) {
        if (that.startingProcessingFilesCallback) that.startingProcessingFilesCallback();
        var sceneFileToLoad;
        var filesToLoad;
        BABYLON.FilesTextures = {};
        if (event && event.dataTransfer && event.dataTransfer.files) {
            filesToLoad = event.dataTransfer.files;
        }
        if (event && event.target && event.target.files) {
            filesToLoad = event.target.files;
        }
        if (filesToLoad && filesToLoad.length > 0) {
            for (var i = 0; i < filesToLoad.length; i++) {
                if (filesToLoad[i].name.indexOf(".babylon") !== -1 && filesToLoad[i].name.indexOf(".manifest") === -1 && filesToLoad[i].name.indexOf(".incremental") === -1 && filesToLoad[i].name.indexOf(".babylonmeshdata") === -1) {
                    sceneFileToLoad = filesToLoad[i];
                } else {
                    if (filesToLoad[i].type.indexOf("image/jpeg") == 0 || filesToLoad[i].type.indexOf("image/png") == 0) {
                        BABYLON.FilesTextures[filesToLoad[i].name] = filesToLoad[i];
                    }
                }
            }
            if (sceneFileToLoad) {
                if (that.currentScene) {
                    that.currentScene.dispose();
                }
                BABYLON.SceneLoader.Load("file:", sceneFileToLoad, that.engine, function (newScene) {
                    that.currentScene = newScene;
                    that.currentScene.executeWhenReady(function () {
                        that.currentScene.activeCamera.attachControl(that.canvas);
                        if (that.sceneLoadedCallback) {
                            that.sceneLoadedCallback(sceneFileToLoad, that.currentScene);
                        }
                    });
                }, function (progress) {
                    if (that.progressCallback) {
                        that.progressCallback(progress);
                    }
                });
            } else {
                console.log("Please provide a valid .babylon file.");
            }
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.PhysicsEngine = function (gravity, iterations) {
        this._world = new CANNON.World();
        this._world.broadphase = new CANNON.NaiveBroadphase();
        this._world.solver.iterations = iterations;
        this._registeredMeshes = [];
        this._physicsMaterials = [];
        this._setGravity(gravity);
    };
    BABYLON.PhysicsEngine.prototype._runOneStep = function (delta) {
        if (delta > 0.1) {
            delta = 0.1;
        } else if (delta <= 0) {
            delta = 1.0 / 60.0;
        }
        this._world.step(delta);
        for (var index = 0; index < this._registeredMeshes.length; index++) {
            var registeredMesh = this._registeredMeshes[index];
            if (registeredMesh.isChild) {
                continue;
            }
            registeredMesh.mesh.position.x = registeredMesh.body.position.x;
            registeredMesh.mesh.position.y = registeredMesh.body.position.z;
            registeredMesh.mesh.position.z = registeredMesh.body.position.y;
            if (!registeredMesh.mesh.rotationQuaternion) {
                registeredMesh.mesh.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
            }
            registeredMesh.mesh.rotationQuaternion.x = registeredMesh.body.quaternion.x;
            registeredMesh.mesh.rotationQuaternion.y = registeredMesh.body.quaternion.z;
            registeredMesh.mesh.rotationQuaternion.z = registeredMesh.body.quaternion.y;
            registeredMesh.mesh.rotationQuaternion.w = -registeredMesh.body.quaternion.w;
        }
    };
    BABYLON.PhysicsEngine.prototype._addMaterial = function (friction, restitution) {
        var index;
        var mat;
        for (index = 0; index < this._physicsMaterials.length; index++) {
            mat = this._physicsMaterials[index];
            if (mat.friction === friction && mat.restitution === restitution) {
                return mat;
            }
        }
        var currentMat = new CANNON.Material();
        currentMat.friction = friction;
        currentMat.restitution = restitution;
        this._physicsMaterials.push(currentMat);
        for (index = 0; index < this._physicsMaterials.length; index++) {
            mat = this._physicsMaterials[index];
            var contactMaterial = new CANNON.ContactMaterial(mat, currentMat, mat.friction * currentMat.friction, mat.restitution * currentMat.restitution);
            contactMaterial.contactEquationStiffness = 1e10;
            contactMaterial.contactEquationRegularizationTime = 10;
            this._world.addContactMaterial(contactMaterial);
        }
        return currentMat;
    };
    BABYLON.PhysicsEngine.prototype._setGravity = function (gravity) {
        this.gravity = gravity || new BABYLON.Vector3(0, -9.82, 0);
        this._world.gravity.set(this.gravity.x, this.gravity.z, this.gravity.y);
    };
    BABYLON.PhysicsEngine.prototype._checkWithEpsilon = function (value) {
        return value < BABYLON.PhysicsEngine.Epsilon ? BABYLON.PhysicsEngine.Epsilon : value;
    };
    BABYLON.PhysicsEngine.prototype._registerMesh = function (mesh, options, onlyShape) {
        var shape = null;
        var initialRotation;
        if (mesh.rotationQuaternion) {
            initialRotation = mesh.rotationQuaternion.clone();
            mesh.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
        }
        this._unregisterMesh(mesh);
        mesh.computeWorldMatrix(true);
        switch (options.impostor) {
        case BABYLON.PhysicsEngine.SphereImpostor:
            var bbox = mesh.getBoundingInfo().boundingBox;
            var radiusX = bbox.maximumWorld.x - bbox.minimumWorld.x;
            var radiusY = bbox.maximumWorld.y - bbox.minimumWorld.y;
            var radiusZ = bbox.maximumWorld.z - bbox.minimumWorld.z;
            shape = new CANNON.Sphere(Math.max(this._checkWithEpsilon(radiusX), this._checkWithEpsilon(radiusY), this._checkWithEpsilon(radiusZ)) / 2);
            break;
        case BABYLON.PhysicsEngine.BoxImpostor:
            var bbox = mesh.getBoundingInfo().boundingBox;
            var min = bbox.minimumWorld;
            var max = bbox.maximumWorld;
            var box = max.subtract(min).scale(0.5);
            shape = new CANNON.Box(new CANNON.Vec3(this._checkWithEpsilon(box.x), this._checkWithEpsilon(box.z), this._checkWithEpsilon(box.y)));
            break;
        case BABYLON.PhysicsEngine.PlaneImpostor:
            shape = new CANNON.Plane();
            break;
        case BABYLON.PhysicsEngine.MeshImpostor:
            var rawVerts = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            var rawFaces = mesh.getIndices();
            var verts = [],
                faces = [];
            mesh.computeWorldMatrix(true);
            for (var i = 0; i < rawVerts.length; i += 3) {
                var transformed = BABYLON.Vector3.Zero();
                BABYLON.Vector3.TransformNormalFromFloatsToRef(rawVerts[i], rawVerts[i + 1], rawVerts[i + 2], mesh.getWorldMatrix(), transformed);
                verts.push(new CANNON.Vec3(transformed.x, transformed.z, transformed.y));
            }
            for (var j = 0; j < rawFaces.length; j += 3) {
                faces.push([rawFaces[j], rawFaces[j + 2], rawFaces[j + 1]]);
            }
            shape = new CANNON.ConvexPolyhedron(verts, faces);
            break;
        }
        if (onlyShape) {
            return shape;
        }
        var material = this._addMaterial(options.friction, options.restitution);
        var body = new CANNON.RigidBody(options.mass, shape, material);
        if (initialRotation) {
            body.quaternion.x = initialRotation.x;
            body.quaternion.z = initialRotation.y;
            body.quaternion.y = initialRotation.z;
            body.quaternion.w = -initialRotation.w;
        }
        body.position.set(mesh.position.x, mesh.position.z, mesh.position.y);
        this._world.add(body);
        this._registeredMeshes.push({
            mesh: mesh,
            body: body,
            material: material
        });
        return body;
    };
    BABYLON.PhysicsEngine.prototype._registerCompound = function (options) {
        var compoundShape = new CANNON.Compound();
        var initialMesh = options.parts[0].mesh;
        var initialPosition = initialMesh.position;
        for (var index = 0; index < options.parts.length; index++) {
            var mesh = options.parts[index].mesh;
            var shape = this._registerMesh(mesh, options.parts[index], true);
            if (index == 0) {
                compoundShape.addChild(shape, new CANNON.Vec3(0, 0, 0));
            } else {
                compoundShape.addChild(shape, new CANNON.Vec3(mesh.position.x, mesh.position.z, mesh.position.y));
            }
        }
        var material = this._addMaterial(options.friction, options.restitution);
        var body = new CANNON.RigidBody(options.mass, compoundShape, material);
        body.position.set(initialPosition.x, initialPosition.z, initialPosition.y);
        this._world.add(body);
        for (var index = 0; index < options.parts.length; index++) {
            var mesh = options.parts[index].mesh;
            this._registeredMeshes.push({
                mesh: mesh,
                body: body,
                material: material,
                isChild: index != 0
            });
        }
        body.parts = options.parts;
        return body;
    };
    BABYLON.PhysicsEngine.prototype._unbindBody = function (body) {
        for (var index = 0; index < this._registeredMeshes.length; index++) {
            var registeredMesh = this._registeredMeshes[index];
            if (registeredMesh.body === body) {
                registeredMesh.body = null;
            }
        }
    };
    BABYLON.PhysicsEngine.prototype._unregisterMesh = function (mesh) {
        for (var index = 0; index < this._registeredMeshes.length; index++) {
            var registeredMesh = this._registeredMeshes[index];
            if (registeredMesh.mesh === mesh) {
                if (registeredMesh.body) {
                    this._world.remove(registeredMesh.body);
                    this._unbindBody(registeredMesh.body);
                }
                this._registeredMeshes.splice(index, 1);
                return;
            }
        }
    };
    BABYLON.PhysicsEngine.prototype._applyImpulse = function (mesh, force, contactPoint) {
        var worldPoint = new CANNON.Vec3(contactPoint.x, contactPoint.z, contactPoint.y);
        var impulse = new CANNON.Vec3(force.x, force.z, force.y);
        for (var index = 0; index < this._registeredMeshes.length; index++) {
            var registeredMesh = this._registeredMeshes[index];
            if (registeredMesh.mesh === mesh) {
                registeredMesh.body.applyImpulse(impulse, worldPoint);
                return;
            }
        }
    };
    BABYLON.PhysicsEngine.prototype._createLink = function (mesh1, mesh2, pivot1, pivot2) {
        var body1, body2;
        for (var index = 0; index < this._registeredMeshes.length; index++) {
            var registeredMesh = this._registeredMeshes[index];
            if (registeredMesh.mesh === mesh1) {
                body1 = registeredMesh.body;
            } else if (registeredMesh.mesh === mesh2) {
                body2 = registeredMesh.body;
            }
        }
        if (!body1 || !body2) {
            return;
        }
        var constraint = new CANNON.PointToPointConstraint(body1, new CANNON.Vec3(pivot1.x, pivot1.z, pivot1.y), body2, new CANNON.Vec3(pivot2.x, pivot2.z, pivot2.y));
        this._world.addConstraint(constraint);
    };
    BABYLON.PhysicsEngine.prototype.dispose = function () {
        while (this._registeredMeshes.length) {
            this._unregisterMesh(this._registeredMeshes[0].mesh);
        }
    };
    BABYLON.PhysicsEngine.IsSupported = function () {
        return window.CANNON !== undefined;
    };
    BABYLON.PhysicsEngine.NoImpostor = 0;
    BABYLON.PhysicsEngine.SphereImpostor = 1;
    BABYLON.PhysicsEngine.BoxImpostor = 2;
    BABYLON.PhysicsEngine.PlaneImpostor = 3;
    BABYLON.PhysicsEngine.CompoundImpostor = 4;
    BABYLON.PhysicsEngine.MeshImpostor = 4;
    BABYLON.PhysicsEngine.Epsilon = 0.001;
})();
var BABYLON = BABYLON || {};
(function () {
    var serializeLight = function (light) {
        var serializationObject = {};
        serializationObject.name = light.name;
        serializationObject.id = light.id;
        if (light instanceof BABYLON.PointLight) {
            serializationObject.type = 0;
            serializationObject.position = light.position.asArray();
        } else if (light instanceof BABYLON.DirectionalLight) {
            serializationObject.type = 1;
            serializationObject.position = light.position.asArray();
            serializationObject.direction = light.position.asArray();
        } else if (light instanceof BABYLON.SpotLight) {
            serializationObject.type = 2;
            serializationObject.position = light.position.asArray();
            serializationObject.direction = light.position.asArray();
            serializationObject.angle = light.angle;
            serializationObject.exponent = light.exponent;
        } else if (light instanceof BABYLON.HemisphericLight) {
            serializationObject.type = 2;
            serializationObject.groundColor = light.groundColor.asArray();
        }
        if (light.intensity) {
            serializationObject.intensity = light.intensity;
        }
        serializationObject.diffuse = light.diffuse.asArray();
        serializationObject.specular = light.specular.asArray();
        return serializationObject;
    };
    var serializeCamera = function (camera) {
        var serializationObject = {};
        serializationObject.name = camera.name;
        serializationObject.id = camera.id;
        serializationObject.position = camera.position.asArray();
        if (camera.parent) {
            serializationObject.parentId = camera.parent.id;
        }
        serializationObject.rotation = camera.rotation.asArray();
        if (camera.lockedTarget && camera.lockedTarget.id) {
            serializationObject.lockedTargetId = camera.lockedTarget.id;
        }
        serializationObject.fov = camera.fov;
        serializationObject.minZ = camera.minZ;
        serializationObject.maxZ = camera.maxZ;
        serializationObject.speed = camera.speed;
        serializationObject.inertia = camera.inertia;
        serializationObject.checkCollisions = camera.checkCollisions;
        serializationObject.applyGravity = camera.applyGravity;
        if (camera.ellipsoid) {
            serializationObject.ellipsoid = camera.ellipsoid.asArray();
        }
        appendAnimations(camera, serializationObject);
        return serializationObject;
    };
    var appendAnimations = function (source, destination) {
        if (source.animations) {
            destination.animations = [];
            for (var animationIndex = 0; animationIndex < source.animations.length; animationIndex++) {
                var animation = source.animations[animationIndex];
                destination.animations.push(serializeAnimation(animation));
            }
        }
    };
    var serializeAnimation = function (animation) {
        var serializationObject = {};
        serializationObject.name = animation.name;
        serializationObject.property = animation.targetProperty;
        serializationObject.framePerSecond = animation.framePerSecond;
        serializationObject.dataType = animation.dataType;
        serializationObject.loopBehavior = animation.loopBehavior;
        var dataType = animation.dataType;
        serializationObject.keys = [];
        for (var index = 0; index < animation._keys.length; index++) {
            var animationKey = animation._keys[index];
            var key = {};
            key.frame = animationKey.frame;
            switch (dataType) {
            case BABYLON.Animation.ANIMATIONTYPE_FLOAT:
                key.values = [animationKey.value];
                break;
            case BABYLON.Animation.ANIMATIONTYPE_QUATERNION:
            case BABYLON.Animation.ANIMATIONTYPE_MATRIX:
            case BABYLON.Animation.ANIMATIONTYPE_VECTOR3:
                key.values = animationKey.value.asArray();
                break;
            }
            serializationObject.keys.push(key);
        }
        return serializationObject;
    };
    var serializeMultiMaterial = function (material) {
        var serializationObject = {};
        serializationObject.name = material.name;
        serializationObject.id = material.id;
        serializationObject.materials = [];
        for (var matIndex = 0; matIndex < material.subMaterials.length; matIndex++) {
            var subMat = material.subMaterials[matIndex];
            if (subMat) {
                serializationObject.materials.push(subMat.id);
            } else {
                serializationObject.materials.push(null);
            }
        }
        return serializationObject;
    };
    var serializeMaterial = function (material) {
        var serializationObject = {};
        serializationObject.name = material.name;
        serializationObject.ambient = material.ambientColor.asArray();
        serializationObject.diffuse = material.diffuseColor.asArray();
        serializationObject.specular = material.specularColor.asArray();
        serializationObject.specularPower = material.specularPower;
        serializationObject.emissive = material.emissiveColor.asArray();
        serializationObject.alpha = material.alpha;
        serializationObject.id = material.id;
        serializationObject.backFaceCulling = material.backFaceCulling;
        if (material.diffuseTexture) {
            serializationObject.diffuseTexture = serializeTexture(material.diffuseTexture);
        }
        if (material.ambientTexture) {
            serializationObject.ambientTexture = serializeTexture(material.ambientTexture);
        }
        if (material.opacityTexture) {
            serializationObject.opacityTexture = serializeTexture(material.opacityTexture);
        }
        if (material.reflectionTexture) {
            serializationObject.reflectionTexture = serializeTexture(material.reflectionTexture);
        }
        if (material.emissiveTexture) {
            serializationObject.emissiveTexture = serializeTexture(material.emissiveTexture);
        }
        if (material.specularTexture) {
            serializationObject.specularTexture = serializeTexture(material.specularTexture);
        }
        if (material.bumpTexture) {
            serializationObject.bumpTexture = serializeTexture(material.bumpTexture);
        }
        return serializationObject;
    };
    var serializeTexture = function (texture) {
        var serializationObject = {};
        if (!texture.name) {
            return null;
        }
        if (texture instanceof BABYLON.CubeTexture) {
            serializationObject.name = texture.name;
            serializationObject.hasAlpha = texture.hasAlpha;
            serializationObject.level = texture.level;
            serializationObject.coordinatesMode = texture.coordinatesMode;
            return serializationObject;
        }
        if (texture instanceof BABYLON.MirrorTexture) {
            serializationObject.renderTargetSize = texture.renderTargetSize;
            serializationObject.renderList = [];
            for (var index = 0; index < texture.renderList.length; index++) {
                serializationObject.renderList.push(texture.renderList[index].id);
            }
            serializationObject.mirrorPlane = texture.mirrorPlane.asArray();
        } else if (texture instanceof BABYLON.RenderTargetTexture) {
            serializationObject.renderTargetSize = texture.renderTargetSize;
            serializationObject.renderList = [];
            for (var index = 0; index < texture.renderList.length; index++) {
                serializationObject.renderList.push(texture.renderList[index].id);
            }
        }
        serializationObject.name = texture.name;
        serializationObject.hasAlpha = texture.hasAlpha;
        serializationObject.level = texture.level;
        serializationObject.coordinatesIndex = texture.coordinatesIndex;
        serializationObject.coordinatesMode = texture.coordinatesMode;
        serializationObject.uOffset = texture.uOffset;
        serializationObject.vOffset = texture.vOffset;
        serializationObject.uScale = texture.uScale;
        serializationObject.vScale = texture.vScale;
        serializationObject.uAng = texture.uAng;
        serializationObject.vAng = texture.vAng;
        serializationObject.wAng = texture.wAng;
        serializationObject.wrapU = texture.wrapU;
        serializationObject.wrapV = texture.wrapV;
        appendAnimations(texture, serializationObject);
        return serializationObject;
    };
    var serializeSkeleton = function (skeleton) {
        var serializationObject = {};
        serializationObject.name = skeleton.name;
        serializationObject.id = skeleton.id;
        serializationObject.bones = [];
        for (var index = 0; index < skeleton.bones.length; index++) {
            var bone = skeleton.bones[index];
            var serializedBone = {
                parentBoneIndex: bone._parent ? bone._parent.id : -1,
                name: bone.name,
                matrix: bone._matrix.toArray()
            };
            serializationObject.bones.push(serializedBone);
            if (bone.animations && bone.animations.length > 0) {
                serializedBone.animation = serializeAnimation(bone.animations[0]);
            }
        }
        return serializationObject;
    };
    var serializeParticleSystem = function (particleSystem) {
        var serializationObject = {};
        serializationObject.emitterId = particleSystem.emitter.id;
        serializationObject.capacity = particleSystem._capacity;
        if (particleSystem.particleTexture) {
            serializationObject.textureName = particleSystem.particleTexture.name;
        }
        serializationObject.minAngularSpeed = particleSystem.minAngularSpeed;
        serializationObject.maxAngularSpeed = particleSystem.maxAngularSpeed;
        serializationObject.minSize = particleSystem.minSize;
        serializationObject.maxSize = particleSystem.maxSize;
        serializationObject.minLifeTime = particleSystem.minLifeTime;
        serializationObject.maxLifeTime = particleSystem.maxLifeTime;
        serializationObject.emitRate = particleSystem.emitRate;
        serializationObject.minEmitBox = particleSystem.minEmitBox.asArray();
        serializationObject.maxEmitBox = particleSystem.maxEmitBox.asArray();
        serializationObject.gravity = particleSystem.gravity.asArray();
        serializationObject.direction1 = particleSystem.direction1.asArray();
        serializationObject.direction2 = particleSystem.direction2.asArray();
        serializationObject.color1 = particleSystem.color1.asArray();
        serializationObject.color2 = particleSystem.color2.asArray();
        serializationObject.colorDead = particleSystem.colorDead.asArray();
        serializationObject.updateSpeed = particleSystem.updateSpeed;
        serializationObject.targetStopDuration = particleSystem.targetStopFrame;
        serializationObject.textureMask = particleSystem.textureMask.asArray();
        serializationObject.blendMode = particleSystem.blendMode;
        return serializationObject;
    };
    var serializeLensFlareSystem = function (lensFlareSystem) {
        var serializationObject = {};
        serializationObject.emitterId = lensFlareSystem._emitter.id;
        serializationObject.borderLimit = lensFlareSystem.borderLimit;
        serializationObject.flares = [];
        for (var index = 0; index < lensFlareSystem.lensFlares.length; index++) {
            var flare = lensFlareSystem.lensFlares[index];
            serializationObject.flares.push({
                size: flare.size,
                position: flare.position,
                color: flare.color.asArray(),
                textureName: BABYLON.Tools.GetFilename(flare.texture.name)
            });
        }
        return serializationObject;
    };
    var serializeShadowGenerator = function (light) {
        var serializationObject = {};
        var shadowGenerator = light._shadowGenerator;
        serializationObject.lightId = light.id;
        serializationObject.mapSize = shadowGenerator.getShadowMap()._size;
        serializationObject.useVarianceShadowMap = shadowGenerator.useVarianceShadowMap;
        serializationObject.renderList = [];
        for (var meshIndex = 0; meshIndex < shadowGenerator.getShadowMap().renderList.length; meshIndex++) {
            var mesh = shadowGenerator.getShadowMap().renderList[meshIndex];
            serializationObject.renderList.push(mesh.id);
        }
        return serializationObject;
    };
    var serializeMesh = function (mesh) {
        var serializationObject = {};
        serializationObject.name = mesh.name;
        serializationObject.id = mesh.id;
        serializationObject.position = mesh.position.asArray();
        if (mesh.rotation) {
            serializationObject.rotation = mesh.rotation.asArray();
        } else if (mesh.rotationQuaternion) {
            serializationObject.rotationQuaternion = mesh.rotationQuaternion.asArray();
        }
        serializationObject.scaling = mesh.scaling.asArray();
        serializationObject.localMatrix = mesh.getPivotMatrix().asArray();
        serializationObject.isEnabled = mesh.isEnabled();
        serializationObject.isVisible = mesh.isVisible;
        serializationObject.infiniteDistance = mesh.infiniteDistance;
        serializationObject.receiveShadows = mesh.receiveShadows;
        serializationObject.billboardMode = mesh.billboardMode;
        serializationObject.visibility = mesh.visibility;
        serializationObject.checkCollisions = mesh.checkCollisions;
        if (mesh.parent) {
            serializationObject.parentId = mesh.parent.id;
        }
        if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.PositionKind)) {
            serializationObject.positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            serializationObject.normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
            if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.UVKind)) {
                serializationObject.uvs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind);
            }
            if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.UV2Kind)) {
                serializationObject.uvs2 = mesh.getVerticesData(BABYLON.VertexBuffer.UV2Kind);
            }
            if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.ColorKind)) {
                serializationObject.colors = mesh.getVerticesData(BABYLON.VertexBuffer.ColorKind);
            }
            if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesWeightsKind)) {
                serializationObject.matricesWeights = mesh.getVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind);
            }
            if (mesh.isVerticesDataPresent(BABYLON.VertexBuffer.MatricesIndicesKind)) {
                serializationObject.matricesWeights = mesh.getVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind);
                serializationObject.matricesWeights._isExpanded = true;
            }
            serializationObject.indices = mesh.getIndices();
            serializationObject.subMeshes = [];
            for (var subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
                var subMesh = mesh.subMeshes[subIndex];
                serializationObject.subMeshes.push({
                    materialIndex: subMesh.materialIndex,
                    verticesStart: subMesh.verticesStart,
                    verticesCount: subMesh.verticesCount,
                    indexStart: subMesh.indexStart,
                    indexCount: subMesh.indexCount
                });
            }
        }
        if (mesh.material) {
            serializationObject.materialId = mesh.material.id;
        } else {
            mesh.material = null;
        } if (mesh.skeleton) {
            serializationObject.skeletonId = mesh.skeleton.id;
        }
        if (mesh.getPhysicsImpostor() !== BABYLON.PhysicsEngine.NoImpostor) {
            serializationObject.physicsMass = mesh.getPhysicsMass();
            serializationObject.physicsFriction = mesh.getPhysicsFriction();
            serializationObject.physicsRestitution = mesh.getPhysicsRestitution();
            switch (mesh.getPhysicsImpostor()) {
            case BABYLON.PhysicsEngine.BoxImpostor:
                serializationObject.physicsImpostor = 1;
                break;
            case BABYLON.PhysicsEngine.SphereImpostor:
                serializationObject.physicsImpostor = 2;
                break;
            }
        }
        appendAnimations(mesh, serializationObject);
        return serializationObject;
    };
    BABYLON.SceneSerializer = {
        Serialize: function (scene) {
            var serializationObject = {};
            serializationObject.useDelayedTextureLoading = scene.useDelayedTextureLoading;
            serializationObject.autoClear = scene.autoClear;
            serializationObject.clearColor = scene.clearColor.asArray();
            serializationObject.ambientColor = scene.ambientColor.asArray();
            serializationObject.gravity = scene.gravity.asArray();
            if (scene.fogMode && scene.fogMode !== 0) {
                serializationObject.fogMode = scene.fogMode;
                serializationObject.fogColor = scene.fogColor.asArray();
                serializationObject.fogStart = scene.fogStart;
                serializationObject.fogEnd = scene.fogEnd;
                serializationObject.fogDensity = scene.fogDensity;
            }
            serializationObject.lights = [];
            for (var index = 0; index < scene.lights.length; index++) {
                var light = scene.lights[index];
                serializationObject.lights.push(serializeLight(light));
            }
            serializationObject.cameras = [];
            for (var index = 0; index < scene.cameras.length; index++) {
                var camera = scene.cameras[index];
                if (camera instanceof BABYLON.FreeCamera) {
                    serializationObject.cameras.push(serializeCamera(camera));
                }
            }
            if (scene.activecamera) {
                serializationObject.activeCameraID = scene.activeCamera.id;
            }
            serializationObject.materials = [];
            serializationObject.multiMaterials = [];
            for (var index = 0; index < scene.materials.length; index++) {
                var material = scene.materials[index];
                if (material instanceof BABYLON.StandardMaterial) {
                    serializationObject.materials.push(serializeMaterial(material));
                } else if (material instanceof BABYLON.MultiMaterial) {
                    serializationObject.multiMaterials.push(serializeMultiMaterial(material));
                }
            }
            serializationObject.skeletons = [];
            for (var index = 0; index < scene.skeletons.length; index++) {
                serializationObject.skeletons.push(serializeSkeleton(scene.skeletons[index]));
            }
            serializationObject.meshes = [];
            for (var index = 0; index < scene.meshes.length; index++) {
                var mesh = scene.meshes[index];
                if (mesh.delayLoadState === BABYLON.Engine.DELAYLOADSTATE_LOADED || mesh.delayLoadState === BABYLON.Engine.DELAYLOADSTATE_NONE) {
                    serializationObject.meshes.push(serializeMesh(mesh));
                }
            }
            serializationObject.particleSystems = [];
            for (var index = 0; index < scene.particleSystems.length; index++) {
                serializationObject.particleSystems.push(serializeParticleSystem(scene.particleSystems[index]));
            }
            serializationObject.lensFlareSystems = [];
            for (var index = 0; index < scene.lensFlareSystems.length; index++) {
                serializationObject.lensFlareSystems.push(serializeLensFlareSystem(scene.lensFlareSystems[index]));
            }
            serializationObject.shadowGenerators = [];
            for (var index = 0; index < scene.lights.length; index++) {
                var light = scene.lights[index];
                if (light._shadowGenerator) {
                    serializationObject.shadowGenerators.push(serializeShadowGenerator(light));
                }
            }
            return serializationObject;
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.Space = {
        LOCAL: 0,
        WORLD: 1
    };
    BABYLON.Axis = {
        X: new BABYLON.Vector3(1, 0, 0),
        Y: new BABYLON.Vector3(0, 1, 0),
        Z: new BABYLON.Vector3(0, 0, 1)
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.SceneLoader = {
        _registeredPlugins: [],
        _getPluginForFilename: function (sceneFilename) {
            var dotPosition = sceneFilename.lastIndexOf(".");
            var extension = sceneFilename.substring(dotPosition).toLowerCase();
            for (var index = 0; index < this._registeredPlugins.length; index++) {
                var plugin = this._registeredPlugins[index];
                if (plugin.extensions.indexOf(extension) !== -1) {
                    return plugin;
                }
            }
            throw new Error("No plugin found to load this file: " + sceneFilename);
        },
        RegisterPlugin: function (plugin) {
            plugin.extensions = plugin.extensions.toLowerCase();
            this._registeredPlugins.push(plugin);
        },
        ImportMesh: function (meshesNames, rootUrl, sceneFilename, scene, onsuccess, progressCallBack, onerror) {
            var database = new BABYLON.Database(rootUrl + sceneFilename);
            scene.database = database;
            var plugin = this._getPluginForFilename(sceneFilename);
            BABYLON.Tools.LoadFile(rootUrl + sceneFilename, function (data) {
                var meshes = [];
                var particleSystems = [];
                var skeletons = [];
                if (!plugin.importMesh(meshesNames, scene, data, rootUrl, meshes, particleSystems, skeletons)) {
                    if (onerror) {
                        onerror(scene);
                    }
                    return;
                }
                if (onsuccess) {
                    onsuccess(meshes, particleSystems, skeletons);
                }
            }, progressCallBack, database);
        },
        Load: function (rootUrl, sceneFilename, engine, onsuccess, progressCallBack, onerror) {
            var plugin = this._getPluginForFilename(sceneFilename.name || sceneFilename);
            var database;
            var loadSceneFromData = function (data) {
                var scene = new BABYLON.Scene(engine);
                scene.database = database;
                if (!plugin.load(scene, data, rootUrl)) {
                    if (onerror) {
                        onerror(scene);
                    }
                    return;
                }
                if (onsuccess) {
                    onsuccess(scene);
                }
            };
            if (rootUrl.indexOf("file:") === -1) {
                database = new BABYLON.Database(rootUrl + sceneFilename);
                BABYLON.Tools.LoadFile(rootUrl + sceneFilename, loadSceneFromData, progressCallBack, database);
            } else {
                BABYLON.Tools.ReadFile(sceneFilename, loadSceneFromData, progressCallBack);
            }
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    var loadCubeTexture = function (rootUrl, parsedTexture, scene) {
        var texture = new BABYLON.CubeTexture(rootUrl + parsedTexture.name, scene);
        texture.name = parsedTexture.name;
        texture.hasAlpha = parsedTexture.hasAlpha;
        texture.level = parsedTexture.level;
        texture.coordinatesMode = parsedTexture.coordinatesMode;
        return texture;
    };
    var loadTexture = function (rootUrl, parsedTexture, scene) {
        if (!parsedTexture.name && !parsedTexture.isRenderTarget) {
            return null;
        }
        if (parsedTexture.isCube) {
            return loadCubeTexture(rootUrl, parsedTexture, scene);
        }
        var texture;
        if (parsedTexture.mirrorPlane) {
            texture = new BABYLON.MirrorTexture(parsedTexture.name, parsedTexture.renderTargetSize, scene);
            texture._waitingRenderList = parsedTexture.renderList;
            texture.mirrorPlane = BABYLON.Plane.FromArray(parsedTexture.mirrorPlane);
        } else if (parsedTexture.isRenderTarget) {
            texture = new BABYLON.RenderTargetTexture(parsedTexture.name, parsedTexture.renderTargetSize, scene);
            texture._waitingRenderList = parsedTexture.renderList;
        } else {
            texture = new BABYLON.Texture(rootUrl + parsedTexture.name, scene);
        }
        texture.name = parsedTexture.name;
        texture.hasAlpha = parsedTexture.hasAlpha;
        texture.level = parsedTexture.level;
        texture.coordinatesIndex = parsedTexture.coordinatesIndex;
        texture.coordinatesMode = parsedTexture.coordinatesMode;
        texture.uOffset = parsedTexture.uOffset;
        texture.vOffset = parsedTexture.vOffset;
        texture.uScale = parsedTexture.uScale;
        texture.vScale = parsedTexture.vScale;
        texture.uAng = parsedTexture.uAng;
        texture.vAng = parsedTexture.vAng;
        texture.wAng = parsedTexture.wAng;
        texture.wrapU = parsedTexture.wrapU;
        texture.wrapV = parsedTexture.wrapV;
        if (parsedTexture.animations) {
            for (var animationIndex = 0; animationIndex < parsedTexture.animations.length; animationIndex++) {
                var parsedAnimation = parsedTexture.animations[animationIndex];
                texture.animations.push(parseAnimation(parsedAnimation));
            }
        }
        return texture;
    };
    var parseSkeleton = function (parsedSkeleton, scene) {
        var skeleton = new BABYLON.Skeleton(parsedSkeleton.name, parsedSkeleton.id, scene);
        for (var index = 0; index < parsedSkeleton.bones.length; index++) {
            var parsedBone = parsedSkeleton.bones[index];
            var parentBone = null;
            if (parsedBone.parentBoneIndex > -1) {
                parentBone = skeleton.bones[parsedBone.parentBoneIndex];
            }
            var bone = new BABYLON.Bone(parsedBone.name, skeleton, parentBone, BABYLON.Matrix.FromArray(parsedBone.matrix));
            if (parsedBone.animation) {
                bone.animations.push(parseAnimation(parsedBone.animation));
            }
        }
        return skeleton;
    };
    var parseMaterial = function (parsedMaterial, scene, rootUrl) {
        var material;
        material = new BABYLON.StandardMaterial(parsedMaterial.name, scene);
        material.ambientColor = BABYLON.Color3.FromArray(parsedMaterial.ambient);
        material.diffuseColor = BABYLON.Color3.FromArray(parsedMaterial.diffuse);
        material.specularColor = BABYLON.Color3.FromArray(parsedMaterial.specular);
        material.specularPower = parsedMaterial.specularPower;
        material.emissiveColor = BABYLON.Color3.FromArray(parsedMaterial.emissive);
        material.alpha = parsedMaterial.alpha;
        material.id = parsedMaterial.id;
        material.backFaceCulling = parsedMaterial.backFaceCulling;
        if (parsedMaterial.diffuseTexture) {
            material.diffuseTexture = loadTexture(rootUrl, parsedMaterial.diffuseTexture, scene);
        }
        if (parsedMaterial.ambientTexture) {
            material.ambientTexture = loadTexture(rootUrl, parsedMaterial.ambientTexture, scene);
        }
        if (parsedMaterial.opacityTexture) {
            material.opacityTexture = loadTexture(rootUrl, parsedMaterial.opacityTexture, scene);
        }
        if (parsedMaterial.reflectionTexture) {
            material.reflectionTexture = loadTexture(rootUrl, parsedMaterial.reflectionTexture, scene);
        }
        if (parsedMaterial.emissiveTexture) {
            material.emissiveTexture = loadTexture(rootUrl, parsedMaterial.emissiveTexture, scene);
        }
        if (parsedMaterial.specularTexture) {
            material.specularTexture = loadTexture(rootUrl, parsedMaterial.specularTexture, scene);
        }
        if (parsedMaterial.bumpTexture) {
            material.bumpTexture = loadTexture(rootUrl, parsedMaterial.bumpTexture, scene);
        }
        return material;
    };
    var parseMaterialById = function (id, parsedData, scene, rootUrl) {
        for (var index = 0; index < parsedData.materials.length; index++) {
            var parsedMaterial = parsedData.materials[index];
            if (parsedMaterial.id === id) {
                return parseMaterial(parsedMaterial, scene, rootUrl);
            }
        }
        return null;
    };
    var parseMultiMaterial = function (parsedMultiMaterial, scene) {
        var multiMaterial = new BABYLON.MultiMaterial(parsedMultiMaterial.name, scene);
        multiMaterial.id = parsedMultiMaterial.id;
        for (var matIndex = 0; matIndex < parsedMultiMaterial.materials.length; matIndex++) {
            var subMatId = parsedMultiMaterial.materials[matIndex];
            if (subMatId) {
                multiMaterial.subMaterials.push(scene.getMaterialByID(subMatId));
            } else {
                multiMaterial.subMaterials.push(null);
            }
        }
        return multiMaterial;
    };
    var parseLensFlareSystem = function (parsedLensFlareSystem, scene, rootUrl) {
        var emitter = scene.getLastEntryByID(parsedLensFlareSystem.emitterId);
        var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem#" + parsedLensFlareSystem.emitterId, emitter, scene);
        lensFlareSystem.borderLimit = parsedLensFlareSystem.borderLimit;
        for (var index = 0; index < parsedLensFlareSystem.flares.length; index++) {
            var parsedFlare = parsedLensFlareSystem.flares[index];
            var flare = new BABYLON.LensFlare(parsedFlare.size, parsedFlare.position, BABYLON.Color3.FromArray(parsedFlare.color), rootUrl + parsedFlare.textureName, lensFlareSystem);
        }
        return lensFlareSystem;
    };
    var parseParticleSystem = function (parsedParticleSystem, scene, rootUrl) {
        var emitter = scene.getLastMeshByID(parsedParticleSystem.emitterId);
        var particleSystem = new BABYLON.ParticleSystem("particles#" + emitter.name, parsedParticleSystem.capacity, scene);
        if (parsedParticleSystem.textureName) {
            particleSystem.particleTexture = new BABYLON.Texture(rootUrl + parsedParticleSystem.textureName, scene);
            particleSystem.particleTexture.name = parsedParticleSystem.textureName;
        }
        particleSystem.minAngularSpeed = parsedParticleSystem.minAngularSpeed;
        particleSystem.maxAngularSpeed = parsedParticleSystem.maxAngularSpeed;
        particleSystem.minSize = parsedParticleSystem.minSize;
        particleSystem.maxSize = parsedParticleSystem.maxSize;
        particleSystem.minLifeTime = parsedParticleSystem.minLifeTime;
        particleSystem.maxLifeTime = parsedParticleSystem.maxLifeTime;
        particleSystem.emitter = emitter;
        particleSystem.emitRate = parsedParticleSystem.emitRate;
        particleSystem.minEmitBox = BABYLON.Vector3.FromArray(parsedParticleSystem.minEmitBox);
        particleSystem.maxEmitBox = BABYLON.Vector3.FromArray(parsedParticleSystem.maxEmitBox);
        particleSystem.gravity = BABYLON.Vector3.FromArray(parsedParticleSystem.gravity);
        particleSystem.direction1 = BABYLON.Vector3.FromArray(parsedParticleSystem.direction1);
        particleSystem.direction2 = BABYLON.Vector3.FromArray(parsedParticleSystem.direction2);
        particleSystem.color1 = BABYLON.Color4.FromArray(parsedParticleSystem.color1);
        particleSystem.color2 = BABYLON.Color4.FromArray(parsedParticleSystem.color2);
        particleSystem.colorDead = BABYLON.Color4.FromArray(parsedParticleSystem.colorDead);
        particleSystem.updateSpeed = parsedParticleSystem.updateSpeed;
        particleSystem.targetStopDuration = parsedParticleSystem.targetStopFrame;
        particleSystem.textureMask = BABYLON.Color4.FromArray(parsedParticleSystem.textureMask);
        particleSystem.blendMode = parsedParticleSystem.blendMode;
        particleSystem.start();
        return particleSystem;
    };
    var parseShadowGenerator = function (parsedShadowGenerator, scene) {
        var light = scene.getLightByID(parsedShadowGenerator.lightId);
        var shadowGenerator = new BABYLON.ShadowGenerator(parsedShadowGenerator.mapSize, light);
        for (var meshIndex = 0; meshIndex < parsedShadowGenerator.renderList.length; meshIndex++) {
            var mesh = scene.getMeshByID(parsedShadowGenerator.renderList[meshIndex]);
            shadowGenerator.getShadowMap().renderList.push(mesh);
        }
        shadowGenerator.useVarianceShadowMap = parsedShadowGenerator.useVarianceShadowMap;
        return shadowGenerator;
    };
    var parseAnimation = function (parsedAnimation) {
        var animation = new BABYLON.Animation(parsedAnimation.name, parsedAnimation.property, parsedAnimation.framePerSecond, parsedAnimation.dataType, parsedAnimation.loopBehavior);
        var dataType = parsedAnimation.dataType;
        var keys = [];
        for (var index = 0; index < parsedAnimation.keys.length; index++) {
            var key = parsedAnimation.keys[index];
            var data;
            switch (dataType) {
            case BABYLON.Animation.ANIMATIONTYPE_FLOAT:
                data = key.values[0];
                break;
            case BABYLON.Animation.ANIMATIONTYPE_QUATERNION:
                data = BABYLON.Quaternion.FromArray(key.values);
                break;
            case BABYLON.Animation.ANIMATIONTYPE_MATRIX:
                data = BABYLON.Matrix.FromArray(key.values);
                break;
            case BABYLON.Animation.ANIMATIONTYPE_VECTOR3:
            default:
                data = BABYLON.Vector3.FromArray(key.values);
                break;
            }
            keys.push({
                frame: key.frame,
                value: data
            });
        }
        animation.setKeys(keys);
        return animation;
    };
    var parseLight = function (parsedLight, scene) {
        var light;
        switch (parsedLight.type) {
        case 0:
            light = new BABYLON.PointLight(parsedLight.name, BABYLON.Vector3.FromArray(parsedLight.position), scene);
            break;
        case 1:
            light = new BABYLON.DirectionalLight(parsedLight.name, BABYLON.Vector3.FromArray(parsedLight.direction), scene);
            light.position = BABYLON.Vector3.FromArray(parsedLight.position);
            break;
        case 2:
            light = new BABYLON.SpotLight(parsedLight.name, BABYLON.Vector3.FromArray(parsedLight.position), BABYLON.Vector3.FromArray(parsedLight.direction), parsedLight.angle, parsedLight.exponent, scene);
            break;
        case 3:
            light = new BABYLON.HemisphericLight(parsedLight.name, BABYLON.Vector3.FromArray(parsedLight.direction), scene);
            light.groundColor = BABYLON.Color3.FromArray(parsedLight.groundColor);
            break;
        }
        light.id = parsedLight.id;
        if (parsedLight.intensity) {
            light.intensity = parsedLight.intensity;
        }
        light.diffuse = BABYLON.Color3.FromArray(parsedLight.diffuse);
        light.specular = BABYLON.Color3.FromArray(parsedLight.specular);
    };
    var parseCamera = function (parsedCamera, scene) {
        var camera = new BABYLON.FreeCamera(parsedCamera.name, BABYLON.Vector3.FromArray(parsedCamera.position), scene);
        camera.id = parsedCamera.id;
        if (parsedCamera.parentId) {
            camera._waitingParentId = parsedCamera.parentId;
        }
        if (parsedCamera.target) {
            camera.setTarget(BABYLON.Vector3.FromArray(parsedCamera.target));
        } else {
            camera.rotation = BABYLON.Vector3.FromArray(parsedCamera.rotation);
        } if (parsedCamera.lockedTargetId) {
            camera._waitingLockedTargetId = parsedCamera.lockedTargetId;
        }
        camera.fov = parsedCamera.fov;
        camera.minZ = parsedCamera.minZ;
        camera.maxZ = parsedCamera.maxZ;
        camera.speed = parsedCamera.speed;
        camera.inertia = parsedCamera.inertia;
        camera.checkCollisions = parsedCamera.checkCollisions;
        camera.applyGravity = parsedCamera.applyGravity;
        if (parsedCamera.ellipsoid) {
            camera.ellipsoid = BABYLON.Vector3.FromArray(parsedCamera.ellipsoid);
        }
        if (parsedCamera.animations) {
            for (var animationIndex = 0; animationIndex < parsedCamera.animations.length; animationIndex++) {
                var parsedAnimation = parsedCamera.animations[animationIndex];
                camera.animations.push(parseAnimation(parsedAnimation));
            }
        }
        if (parsedCamera.autoAnimate) {
            scene.beginAnimation(camera, parsedCamera.autoAnimateFrom, parsedCamera.autoAnimateTo, parsedCamera.autoAnimateLoop, 1.0);
        }
        return camera;
    };
    var parseMesh = function (parsedMesh, scene, rootUrl) {
        var mesh = new BABYLON.Mesh(parsedMesh.name, scene);
        mesh.id = parsedMesh.id;
        mesh.position = BABYLON.Vector3.FromArray(parsedMesh.position);
        if (parsedMesh.rotation) {
            mesh.rotation = BABYLON.Vector3.FromArray(parsedMesh.rotation);
        } else if (parsedMesh.rotationQuaternion) {
            mesh.rotationQuaternion = BABYLON.Quaternion.FromArray(parsedMesh.rotationQuaternion);
        }
        mesh.scaling = BABYLON.Vector3.FromArray(parsedMesh.scaling);
        if (parsedMesh.localMatrix) {
            mesh.setPivotMatrix(BABYLON.Matrix.FromArray(parsedMesh.localMatrix));
        }
        mesh.setEnabled(parsedMesh.isEnabled);
        mesh.isVisible = parsedMesh.isVisible;
        mesh.infiniteDistance = parsedMesh.infiniteDistance;
        mesh.receiveShadows = parsedMesh.receiveShadows;
        mesh.billboardMode = parsedMesh.billboardMode;
        if (parsedMesh.visibility !== undefined) {
            mesh.visibility = parsedMesh.visibility;
        }
        mesh.checkCollisions = parsedMesh.checkCollisions;
        mesh._shouldGenerateFlatShading = parsedMesh.useFlatShading;
        if (parsedMesh.parentId) {
            mesh.parent = scene.getLastEntryByID(parsedMesh.parentId);
        }
        if (parsedMesh.delayLoadingFile) {
            mesh.delayLoadState = BABYLON.Engine.DELAYLOADSTATE_NOTLOADED;
            mesh.delayLoadingFile = rootUrl + parsedMesh.delayLoadingFile;
            mesh._boundingInfo = new BABYLON.BoundingInfo(BABYLON.Vector3.FromArray(parsedMesh.boundingBoxMinimum), BABYLON.Vector3.FromArray(parsedMesh.boundingBoxMaximum));
            mesh._delayInfo = [];
            if (parsedMesh.hasUVs) {
                mesh._delayInfo.push(BABYLON.VertexBuffer.UVKind);
            }
            if (parsedMesh.hasUVs2) {
                mesh._delayInfo.push(BABYLON.VertexBuffer.UV2Kind);
            }
            if (parsedMesh.hasColors) {
                mesh._delayInfo.push(BABYLON.VertexBuffer.ColorKind);
            }
            if (parsedMesh.hasMatricesIndices) {
                mesh._delayInfo.push(BABYLON.VertexBuffer.MatricesIndicesKind);
            }
            if (parsedMesh.hasMatricesWeights) {
                mesh._delayInfo.push(BABYLON.VertexBuffer.MatricesWeightsKind);
            }
            mesh._delayLoadingFunction = importGeometry;
        } else {
            importGeometry(parsedMesh, mesh);
        } if (parsedMesh.materialId) {
            mesh.setMaterialByID(parsedMesh.materialId);
        } else {
            mesh.material = null;
        } if (parsedMesh.skeletonId > -1) {
            mesh.skeleton = scene.getLastSkeletonByID(parsedMesh.skeletonId);
        }
        if (parsedMesh.physicsImpostor) {
            if (!scene.isPhysicsEnabled()) {
                scene.enablePhysics();
            }
            switch (parsedMesh.physicsImpostor) {
            case 1:
                mesh.setPhysicsState({
                    impostor: BABYLON.PhysicsEngine.BoxImpostor,
                    mass: parsedMesh.physicsMass,
                    friction: parsedMesh.physicsFriction,
                    restitution: parsedMesh.physicsRestitution
                });
                break;
            case 2:
                mesh.setPhysicsState({
                    impostor: BABYLON.PhysicsEngine.SphereImpostor,
                    mass: parsedMesh.physicsMass,
                    friction: parsedMesh.physicsFriction,
                    restitution: parsedMesh.physicsRestitution
                });
                break;
            }
        }
        if (parsedMesh.animations) {
            for (var animationIndex = 0; animationIndex < parsedMesh.animations.length; animationIndex++) {
                var parsedAnimation = parsedMesh.animations[animationIndex];
                mesh.animations.push(parseAnimation(parsedAnimation));
            }
        }
        if (parsedMesh.autoAnimate) {
            scene.beginAnimation(mesh, parsedMesh.autoAnimateFrom, parsedMesh.autoAnimateTo, parsedMesh.autoAnimateLoop, 1.0);
        }
        return mesh;
    };
    var isDescendantOf = function (mesh, names, hierarchyIds) {
        names = (names instanceof Array) ? names : [names];
        for (var i in names) {
            if (mesh.name === names[i]) {
                hierarchyIds.push(mesh.id);
                return true;
            }
        }
        if (mesh.parentId && hierarchyIds.indexOf(mesh.parentId) !== -1) {
            hierarchyIds.push(mesh.id);
            return true;
        }
        return false;
    };
    var importGeometry = function (parsedGeometry, mesh) {
        if (parsedGeometry.positions && parsedGeometry.normals && parsedGeometry.indices) {
            mesh.setVerticesData(parsedGeometry.positions, BABYLON.VertexBuffer.PositionKind, false);
            mesh.setVerticesData(parsedGeometry.normals, BABYLON.VertexBuffer.NormalKind, false);
            if (parsedGeometry.uvs) {
                mesh.setVerticesData(parsedGeometry.uvs, BABYLON.VertexBuffer.UVKind, false);
            }
            if (parsedGeometry.uvs2) {
                mesh.setVerticesData(parsedGeometry.uvs2, BABYLON.VertexBuffer.UV2Kind, false);
            }
            if (parsedGeometry.colors) {
                mesh.setVerticesData(parsedGeometry.colors, BABYLON.VertexBuffer.ColorKind, false);
            }
            if (parsedGeometry.matricesIndices) {
                if (!parsedGeometry.matricesIndices._isExpanded) {
                    var floatIndices = [];
                    for (var i = 0; i < parsedGeometry.matricesIndices.length; i++) {
                        var matricesIndex = parsedGeometry.matricesIndices[i];
                        floatIndices.push(matricesIndex & 0x000000FF);
                        floatIndices.push((matricesIndex & 0x0000FF00) >> 8);
                        floatIndices.push((matricesIndex & 0x00FF0000) >> 16);
                        floatIndices.push(matricesIndex >> 24);
                    }
                    mesh.setVerticesData(floatIndices, BABYLON.VertexBuffer.MatricesIndicesKind, false);
                } else {
                    delete parsedGeometry.matricesIndices._isExpanded;
                    mesh.setVerticesData(parsedGeometry.matricesIndices, BABYLON.VertexBuffer.MatricesIndicesKind, false);
                }
            }
            if (parsedGeometry.matricesWeights) {
                mesh.setVerticesData(parsedGeometry.matricesWeights, BABYLON.VertexBuffer.MatricesWeightsKind, false);
            }
            mesh.setIndices(parsedGeometry.indices);
        }
        if (parsedGeometry.subMeshes) {
            mesh.subMeshes = [];
            for (var subIndex = 0; subIndex < parsedGeometry.subMeshes.length; subIndex++) {
                var parsedSubMesh = parsedGeometry.subMeshes[subIndex];
                var subMesh = new BABYLON.SubMesh(parsedSubMesh.materialIndex, parsedSubMesh.verticesStart, parsedSubMesh.verticesCount, parsedSubMesh.indexStart, parsedSubMesh.indexCount, mesh);
            }
        }
        mesh.computeWorldMatrix(true);
        if (mesh._shouldGenerateFlatShading) {
            mesh.convertToFlatShadedMesh();
            delete mesh._shouldGenerateFlatShading;
        }
        var scene = mesh.getScene();
        if (scene._selectionOctree) {
            scene._selectionOctree.addMesh(mesh);
        }
    };
    BABYLON.SceneLoader.RegisterPlugin({
        extensions: ".babylon",
        importMesh: function (meshesNames, scene, data, rootUrl, meshes, particleSystems, skeletons) {
            var parsedData = JSON.parse(data);
            var loadedSkeletonsIds = [];
            var loadedMaterialsIds = [];
            var hierarchyIds = [];
            for (var index = 0; index < parsedData.meshes.length; index++) {
                var parsedMesh = parsedData.meshes[index];
                if (!meshesNames || isDescendantOf(parsedMesh, meshesNames, hierarchyIds)) {
                    if (meshesNames instanceof Array) {
                        delete meshesNames[meshesNames.indexOf(parsedMesh.name)];
                    }
                    if (parsedMesh.materialId) {
                        var materialFound = (loadedMaterialsIds.indexOf(parsedMesh.materialId) !== -1);
                        if (!materialFound) {
                            for (var multimatIndex = 0; multimatIndex < parsedData.multiMaterials.length; multimatIndex++) {
                                var parsedMultiMaterial = parsedData.multiMaterials[multimatIndex];
                                if (parsedMultiMaterial.id == parsedMesh.materialId) {
                                    for (var matIndex = 0; matIndex < parsedMultiMaterial.materials.length; matIndex++) {
                                        var subMatId = parsedMultiMaterial.materials[matIndex];
                                        loadedMaterialsIds.push(subMatId);
                                        parseMaterialById(subMatId, parsedData, scene, rootUrl);
                                    }
                                    loadedMaterialsIds.push(parsedMultiMaterial.id);
                                    parseMultiMaterial(parsedMultiMaterial, scene);
                                    materialFound = true;
                                    break;
                                }
                            }
                        }
                        if (!materialFound) {
                            loadedMaterialsIds.push(parsedMesh.materialId);
                            parseMaterialById(parsedMesh.materialId, parsedData, scene, rootUrl);
                        }
                    }
                    if (parsedMesh.skeletonId > -1 && scene.skeletons) {
                        var skeletonAlreadyLoaded = (loadedSkeletonsIds.indexOf(parsedMesh.skeletonId) > -1);
                        if (!skeletonAlreadyLoaded) {
                            for (var skeletonIndex = 0; skeletonIndex < parsedData.skeletons.length; skeletonIndex++) {
                                var parsedSkeleton = parsedData.skeletons[skeletonIndex];
                                if (parsedSkeleton.id === parsedMesh.skeletonId) {
                                    skeletons.push(parseSkeleton(parsedSkeleton, scene));
                                    loadedSkeletonsIds.push(parsedSkeleton.id);
                                }
                            }
                        }
                    }
                    var mesh = parseMesh(parsedMesh, scene, rootUrl);
                    meshes.push(mesh);
                }
            }
            if (parsedData.particleSystems) {
                for (var index = 0; index < parsedData.particleSystems.length; index++) {
                    var parsedParticleSystem = parsedData.particleSystems[index];
                    if (hierarchyIds.indexOf(parsedParticleSystem.emitterId) !== -1) {
                        particleSystems.push(parseParticleSystem(parsedParticleSystem, scene, rootUrl));
                    }
                }
            }
            return true;
        },
        load: function (scene, data, rootUrl) {
            var parsedData = JSON.parse(data);
            scene.useDelayedTextureLoading = parsedData.useDelayedTextureLoading;
            scene.autoClear = parsedData.autoClear;
            scene.clearColor = BABYLON.Color3.FromArray(parsedData.clearColor);
            scene.ambientColor = BABYLON.Color3.FromArray(parsedData.ambientColor);
            scene.gravity = BABYLON.Vector3.FromArray(parsedData.gravity);
            if (parsedData.fogMode && parsedData.fogMode !== 0) {
                scene.fogMode = parsedData.fogMode;
                scene.fogColor = BABYLON.Color3.FromArray(parsedData.fogColor);
                scene.fogStart = parsedData.fogStart;
                scene.fogEnd = parsedData.fogEnd;
                scene.fogDensity = parsedData.fogDensity;
            }
            for (var index = 0; index < parsedData.lights.length; index++) {
                var parsedLight = parsedData.lights[index];
                parseLight(parsedLight, scene);
            }
            for (var index = 0; index < parsedData.cameras.length; index++) {
                var parsedCamera = parsedData.cameras[index];
                parseCamera(parsedCamera, scene);
            }
            if (parsedData.activeCameraID) {
                scene.setActiveCameraByID(parsedData.activeCameraID);
            }
            if (parsedData.materials) {
                for (var index = 0; index < parsedData.materials.length; index++) {
                    var parsedMaterial = parsedData.materials[index];
                    parseMaterial(parsedMaterial, scene, rootUrl);
                }
            }
            if (parsedData.multiMaterials) {
                for (var index = 0; index < parsedData.multiMaterials.length; index++) {
                    var parsedMultiMaterial = parsedData.multiMaterials[index];
                    parseMultiMaterial(parsedMultiMaterial, scene);
                }
            }
            if (parsedData.skeletons) {
                for (var index = 0; index < parsedData.skeletons.length; index++) {
                    var parsedSkeleton = parsedData.skeletons[index];
                    parseSkeleton(parsedSkeleton, scene);
                }
            }
            for (var index = 0; index < parsedData.meshes.length; index++) {
                var parsedMesh = parsedData.meshes[index];
                parseMesh(parsedMesh, scene, rootUrl);
            }
            for (var index = 0; index < scene.cameras.length; index++) {
                var camera = scene.cameras[index];
                if (camera._waitingParentId) {
                    camera.parent = scene.getLastEntryByID(camera._waitingParentId);
                    delete camera._waitingParentId;
                }
                if (camera._waitingLockedTargetId) {
                    camera.lockedTarget = scene.getLastEntryByID(camera._waitingLockedTargetId);
                    delete camera._waitingLockedTargetId;
                }
            }
            if (parsedData.particleSystems) {
                for (var index = 0; index < parsedData.particleSystems.length; index++) {
                    var parsedParticleSystem = parsedData.particleSystems[index];
                    parseParticleSystem(parsedParticleSystem, scene, rootUrl);
                }
            }
            if (parsedData.lensFlareSystems) {
                for (var index = 0; index < parsedData.lensFlareSystems.length; index++) {
                    var parsedLensFlareSystem = parsedData.lensFlareSystems[index];
                    parseLensFlareSystem(parsedLensFlareSystem, scene, rootUrl);
                }
            }
            if (parsedData.shadowGenerators) {
                for (var index = 0; index < parsedData.shadowGenerators.length; index++) {
                    var parsedShadowGenerator = parsedData.shadowGenerators[index];
                    parseShadowGenerator(parsedShadowGenerator, scene);
                }
            }
            return true;
        }
    });
})();
var BABYLON = BABYLON || {};
(function () {
    var currentCSGMeshId = 0;
    BABYLON.CSG = function () {
        this.polygons = [];
    };
    BABYLON.CSG.FromMesh = function (mesh) {
        var vertex, normal, uv, position, polygon, polygons = [],
            vertices;
        if (mesh instanceof BABYLON.Mesh) {
            mesh.computeWorldMatrix(true);
            this.matrix = mesh.getWorldMatrix();
            this.position = mesh.position.clone();
            this.rotation = mesh.rotation.clone();
            this.scaling = mesh.scaling.clone();
        } else {
            throw 'BABYLON.CSG:Wrong Mesh type,must be BABYLON.Mesh';
        }
        var indices = mesh.getIndices(),
            positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind),
            normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind),
            uvs = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind);
        var subMeshes = mesh.subMeshes;
        for (var sm = 0, sml = subMeshes.length; sm < sml; sm++) {
            for (var i = subMeshes[sm].indexStart, il = subMeshes[sm].indexCount + subMeshes[sm].indexStart; i < il; i += 3) {
                vertices = [];
                for (var j = 0; j < 3; j++) {
                    normal = new BABYLON.Vector3(normals[indices[i + j] * 3], normals[indices[i + j] * 3 + 1], normals[indices[i + j] * 3 + 2]);
                    uv = new BABYLON.Vector2(uvs[indices[i + j] * 2], uvs[indices[i + j] * 2 + 1]);
                    position = new BABYLON.Vector3(positions[indices[i + j] * 3], positions[indices[i + j] * 3 + 1], positions[indices[i + j] * 3 + 2]);
                    position = BABYLON.Vector3.TransformCoordinates(position, this.matrix);
                    normal = BABYLON.Vector3.TransformNormal(normal, this.matrix);
                    vertex = new BABYLON.CSG.Vertex(position, normal, uv);
                    vertices.push(vertex);
                }
                polygon = new BABYLON.CSG.Polygon(vertices, {
                    subMeshId: sm,
                    meshId: currentCSGMeshId,
                    materialIndex: subMeshes[sm].materialIndex
                });
                if (polygon.plane) polygons.push(polygon);
            }
        }
        var csg = BABYLON.CSG.fromPolygons(polygons);
        csg.copyTransformAttributes(this);
        currentCSGMeshId++;
        return csg;
    };
    BABYLON.CSG.fromPolygons = function (polygons) {
        var csg = new BABYLON.CSG();
        csg.polygons = polygons;
        return csg;
    };
    BABYLON.CSG.prototype = {
        clone: function () {
            var csg = new BABYLON.CSG();
            csg.polygons = this.polygons.map(function (p) {
                return p.clone();
            });
            csg.copyTransformAttributes(this);
            return csg;
        },
        toPolygons: function () {
            return this.polygons;
        },
        union: function (csg) {
            var a = new BABYLON.CSG.Node(this.clone().polygons);
            var b = new BABYLON.CSG.Node(csg.clone().polygons);
            a.clipTo(b);
            b.clipTo(a);
            b.invert();
            b.clipTo(a);
            b.invert();
            a.build(b.allPolygons());
            return BABYLON.CSG.fromPolygons(a.allPolygons()).copyTransformAttributes(this);
        },
        subtract: function (csg) {
            var a = new BABYLON.CSG.Node(this.clone().polygons);
            var b = new BABYLON.CSG.Node(csg.clone().polygons);
            a.invert();
            a.clipTo(b);
            b.clipTo(a);
            b.invert();
            b.clipTo(a);
            b.invert();
            a.build(b.allPolygons());
            a.invert();
            return BABYLON.CSG.fromPolygons(a.allPolygons()).copyTransformAttributes(this);
        },
        intersect: function (csg) {
            var a = new BABYLON.CSG.Node(this.clone().polygons);
            var b = new BABYLON.CSG.Node(csg.clone().polygons);
            a.invert();
            b.clipTo(a);
            b.invert();
            a.clipTo(b);
            b.clipTo(a);
            a.build(b.allPolygons());
            a.invert();
            return BABYLON.CSG.fromPolygons(a.allPolygons()).copyTransformAttributes(this);
        },
        inverse: function () {
            var csg = this.clone();
            csg.polygons.map(function (p) {
                p.flip();
            });
            return csg;
        }
    };
    BABYLON.CSG.prototype.copyTransformAttributes = function (object) {
        this.matrix = object.matrix;
        this.position = object.position;
        this.rotation = object.rotation;
        this.scaling = object.scaling;
        return this;
    };
    BABYLON.CSG.prototype.buildMeshGeometry = function (name, scene, keepSubMeshes) {
        var matrix = this.matrix.clone();
        matrix.invert();
        var mesh = new BABYLON.Mesh(name, scene),
            vertices = [],
            indices = [],
            normals = [],
            uvs = [],
            vertex, normal, uv, polygons = this.polygons,
            polygonIndices = [0, 0, 0],
            polygon, vertice_dict = {}, vertex_idx, currentIndex = 0,
            subMesh_dict = {}, subMesh_obj;
        if (keepSubMeshes) {
            polygons.sort(function (a, b) {
                if (a.shared.meshId === b.shared.meshId) {
                    return a.shared.subMeshId - b.shared.subMeshId;
                } else {
                    return a.shared.meshId - b.shared.meshId;
                }
            });
        }
        for (var i = 0, il = polygons.length; i < il; i++) {
            polygon = polygons[i];
            if (!subMesh_dict[polygon.shared.meshId]) {
                subMesh_dict[polygon.shared.meshId] = {};
            }
            if (!subMesh_dict[polygon.shared.meshId][polygon.shared.subMeshId]) {
                subMesh_dict[polygon.shared.meshId][polygon.shared.subMeshId] = {
                    indexStart: +Infinity,
                    indexEnd: -Infinity,
                    materialIndex: polygon.shared.materialIndex
                };
            }
            subMesh_obj = subMesh_dict[polygon.shared.meshId][polygon.shared.subMeshId];
            for (var j = 2, jl = polygon.vertices.length; j < jl; j++) {
                polygonIndices[0] = 0;
                polygonIndices[1] = j - 1;
                polygonIndices[2] = j;
                for (var k = 0; k < 3; k++) {
                    vertex = polygon.vertices[polygonIndices[k]].pos;
                    normal = polygon.vertices[polygonIndices[k]].normal;
                    uv = polygon.vertices[polygonIndices[k]].uv;
                    vertex = new BABYLON.Vector3(vertex.x, vertex.y, vertex.z);
                    normal = new BABYLON.Vector3(normal.x, normal.y, normal.z);
                    vertex = BABYLON.Vector3.TransformCoordinates(vertex, matrix);
                    normal = BABYLON.Vector3.TransformNormal(normal, matrix);
                    vertex_idx = vertice_dict[vertex.x + ',' + vertex.y + ',' + vertex.z];
                    if (!(typeof vertex_idx !== 'undefined' && normals[vertex_idx * 3] === normal.x && normals[vertex_idx * 3 + 1] === normal.y && normals[vertex_idx * 3 + 2] === normal.z && uvs[vertex_idx * 2] === uv.x && uvs[vertex_idx * 2 + 1] === uv.y)) {
                        vertices.push(vertex.x, vertex.y, vertex.z);
                        uvs.push(uv.x, uv.y);
                        normals.push(normal.x, normal.y, normal.z);
                        vertex_idx = vertice_dict[vertex.x + ',' + vertex.y + ',' + vertex.z] = (vertices.length / 3) - 1;
                    }
                    indices.push(vertex_idx);
                    subMesh_obj.indexStart = Math.min(currentIndex, subMesh_obj.indexStart);
                    subMesh_obj.indexEnd = Math.max(currentIndex, subMesh_obj.indexEnd);
                    currentIndex++;
                }
            }
        }
        mesh.setVerticesData(vertices, BABYLON.VertexBuffer.PositionKind);
        mesh.setVerticesData(normals, BABYLON.VertexBuffer.NormalKind);
        mesh.setVerticesData(uvs, BABYLON.VertexBuffer.UVKind);
        mesh.setIndices(indices);
        if (keepSubMeshes) {
            var materialIndexOffset = 0,
                materialMaxIndex;
            mesh.subMeshes.length = 0;
            for (var m in subMesh_dict) {
                materialMaxIndex = -1;
                for (var sm in subMesh_dict[m]) {
                    subMesh_obj = subMesh_dict[m][sm];
                    BABYLON.SubMesh.CreateFromIndices(subMesh_obj.materialIndex + materialIndexOffset, subMesh_obj.indexStart, subMesh_obj.indexEnd - subMesh_obj.indexStart + 1, mesh);
                    materialMaxIndex = Math.max(subMesh_obj.materialIndex, materialMaxIndex);
                }
                materialIndexOffset += ++materialMaxIndex;
            }
        }
        return mesh;
    };
    BABYLON.CSG.prototype.toMesh = function (name, material, scene, keepSubMeshes) {
        var mesh = this.buildMeshGeometry(name, scene, keepSubMeshes);
        mesh.material = material;
        mesh.position.copyFrom(this.position);
        mesh.rotation.copyFrom(this.rotation);
        mesh.scaling.copyFrom(this.scaling);
        mesh.computeWorldMatrix(true);
        return mesh;
    };
    BABYLON.CSG.Vector = function (x, y, z) {
        if (arguments.length == 3) {
            this.x = x;
            this.y = y;
            this.z = z;
        } else if ('x' in x) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else {
            this.x = x[0];
            this.y = x[1];
            this.z = x[2];
        }
    };
    BABYLON.CSG.Vector.prototype = {
        clone: function () {
            return new BABYLON.CSG.Vector(this.x, this.y, this.z);
        },
        negated: function () {
            return new BABYLON.CSG.Vector(-this.x, -this.y, -this.z);
        },
        plus: function (a) {
            return new BABYLON.CSG.Vector(this.x + a.x, this.y + a.y, this.z + a.z);
        },
        minus: function (a) {
            return new BABYLON.CSG.Vector(this.x - a.x, this.y - a.y, this.z - a.z);
        },
        times: function (a) {
            return new BABYLON.CSG.Vector(this.x * a, this.y * a, this.z * a);
        },
        dividedBy: function (a) {
            return new BABYLON.CSG.Vector(this.x / a, this.y / a, this.z / a);
        },
        dot: function (a) {
            return this.x * a.x + this.y * a.y + this.z * a.z;
        },
        lerp: function (a, t) {
            return this.plus(a.minus(this).times(t));
        },
        length: function () {
            return Math.sqrt(this.dot(this));
        },
        lengthSq: function () {
            return this.dot(this);
        },
        unit: function () {
            return this.dividedBy(this.length());
        },
        cross: function (a) {
            return new BABYLON.CSG.Vector(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
        }
    };
    BABYLON.CSG.Vertex = function (pos, normal, uv) {
        this.pos = new BABYLON.CSG.Vector(pos);
        this.normal = new BABYLON.CSG.Vector(normal);
        this.uv = new BABYLON.CSG.Vector(uv.x, uv.y, 0);
    };
    BABYLON.CSG.Vertex.prototype = {
        clone: function () {
            return new BABYLON.CSG.Vertex(this.pos.clone(), this.normal.clone(), this.uv.clone());
        },
        flip: function () {
            this.normal = this.normal.negated();
        },
        interpolate: function (other, t) {
            return new BABYLON.CSG.Vertex(this.pos.lerp(other.pos, t), this.normal.lerp(other.normal, t), this.uv.lerp(other.uv, t));
        }
    };
    BABYLON.CSG.Plane = function (normal, w) {
        this.normal = normal;
        this.w = w;
    };
    BABYLON.CSG.Plane.EPSILON = 1e-5;
    BABYLON.CSG.Plane.fromPoints = function (a, b, c) {
        var v0 = c.minus(a);
        var v1 = b.minus(a);
        if (v0.lengthSq() === 0 || v1.lengthSq() === 0) {
            return null;
        }
        var n = c.minus(a).cross(b.minus(a)).unit();
        return new BABYLON.CSG.Plane(n, n.dot(a));
    };
    BABYLON.CSG.Plane.prototype = {
        clone: function () {
            return new BABYLON.CSG.Plane(this.normal.clone(), this.w);
        },
        flip: function () {
            this.normal = this.normal.negated();
            this.w = -this.w;
        },
        splitPolygon: function (polygon, coplanarFront, coplanarBack, front, back) {
            var COPLANAR = 0;
            var FRONT = 1;
            var BACK = 2;
            var SPANNING = 3;
            var polygonType = 0;
            var types = [];
            for (var i = 0; i < polygon.vertices.length; i++) {
                var t = this.normal.dot(polygon.vertices[i].pos) - this.w;
                var type = (t < -BABYLON.CSG.Plane.EPSILON) ? BACK : (t > BABYLON.CSG.Plane.EPSILON) ? FRONT : COPLANAR;
                polygonType |= type;
                types.push(type);
            }
            switch (polygonType) {
            case COPLANAR:
                (this.normal.dot(polygon.plane.normal) > 0 ? coplanarFront : coplanarBack).push(polygon);
                break;
            case FRONT:
                front.push(polygon);
                break;
            case BACK:
                back.push(polygon);
                break;
            case SPANNING:
                var f = [],
                    b = [];
                for (var i = 0; i < polygon.vertices.length; i++) {
                    var j = (i + 1) % polygon.vertices.length;
                    var ti = types[i],
                        tj = types[j];
                    var vi = polygon.vertices[i],
                        vj = polygon.vertices[j];
                    if (ti != BACK) f.push(vi);
                    if (ti != FRONT) b.push(ti != BACK ? vi.clone() : vi);
                    if ((ti | tj) == SPANNING) {
                        var t = (this.w - this.normal.dot(vi.pos)) / this.normal.dot(vj.pos.minus(vi.pos));
                        var v = vi.interpolate(vj, t);
                        f.push(v);
                        b.push(v.clone());
                    }
                }
                if (f.length >= 3) front.push(new BABYLON.CSG.Polygon(f, polygon.shared));
                if (b.length >= 3) back.push(new BABYLON.CSG.Polygon(b, polygon.shared));
                break;
            }
        }
    };
    BABYLON.CSG.Polygon = function (vertices, shared) {
        this.vertices = vertices;
        this.shared = shared;
        this.plane = BABYLON.CSG.Plane.fromPoints(vertices[0].pos, vertices[1].pos, vertices[2].pos);
    };
    BABYLON.CSG.Polygon.prototype = {
        clone: function () {
            var vertices = this.vertices.map(function (v) {
                return v.clone();
            });
            return new BABYLON.CSG.Polygon(vertices, this.shared);
        },
        flip: function () {
            this.vertices.reverse().map(function (v) {
                v.flip();
            });
            this.plane.flip();
        }
    };
    BABYLON.CSG.Node = function (polygons) {
        this.plane = null;
        this.front = null;
        this.back = null;
        this.polygons = [];
        if (polygons) this.build(polygons);
    };
    BABYLON.CSG.Node.prototype = {
        clone: function () {
            var node = new BABYLON.CSG.Node();
            node.plane = this.plane && this.plane.clone();
            node.front = this.front && this.front.clone();
            node.back = this.back && this.back.clone();
            node.polygons = this.polygons.map(function (p) {
                return p.clone();
            });
            return node;
        },
        invert: function () {
            for (var i = 0; i < this.polygons.length; i++) {
                this.polygons[i].flip();
            }
            this.plane.flip();
            if (this.front) {
                this.front.invert();
            }
            if (this.back) {
                this.back.invert();
            }
            var temp = this.front;
            this.front = this.back;
            this.back = temp;
        },
        clipPolygons: function (polygons) {
            if (!this.plane) return polygons.slice();
            var front = [],
                back = [];
            for (var i = 0; i < polygons.length; i++) {
                this.plane.splitPolygon(polygons[i], front, back, front, back);
            }
            if (this.front) {
                front = this.front.clipPolygons(front);
            }
            if (this.back) {
                back = this.back.clipPolygons(back);
            } else {
                back = [];
            }
            return front.concat(back);
        },
        clipTo: function (bsp) {
            this.polygons = bsp.clipPolygons(this.polygons);
            if (this.front) this.front.clipTo(bsp);
            if (this.back) this.back.clipTo(bsp);
        },
        allPolygons: function () {
            var polygons = this.polygons.slice();
            if (this.front) polygons = polygons.concat(this.front.allPolygons());
            if (this.back) polygons = polygons.concat(this.back.allPolygons());
            return polygons;
        },
        build: function (polygons) {
            if (!polygons.length) return;
            if (!this.plane) this.plane = polygons[0].plane.clone();
            var front = [],
                back = [];
            for (var i = 0; i < polygons.length; i++) {
                this.plane.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
            }
            if (front.length) {
                if (!this.front) this.front = new BABYLON.CSG.Node();
                this.front.build(front);
            }
            if (back.length) {
                if (!this.back) this.back = new BABYLON.CSG.Node();
                this.back.build(back);
            }
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.OculusDistortionCorrectionPostProcess = function (name, camera, isRightEye, cameraSettings) {
        BABYLON.PostProcess.call(this, name, "oculusDistortionCorrection", ['LensCenter', 'Scale', 'ScaleIn', 'HmdWarpParam'], null, cameraSettings.PostProcessScaleFactor, camera, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null);
        this._isRightEye = isRightEye;
        this._distortionFactors = cameraSettings.DistortionK;
        this._postProcessScaleFactor = cameraSettings.PostProcessScaleFactor;
        this._lensCenterOffset = cameraSettings.LensCenterOffset;
    };
    BABYLON.OculusDistortionCorrectionPostProcess.prototype = Object.create(BABYLON.PostProcess.prototype);
    BABYLON.OculusDistortionCorrectionPostProcess.prototype.onSizeChanged = function () {
        this.aspectRatio = this.width * .5 / this.height;
        this._scaleIn = new BABYLON.Vector2(2, 2 / this.aspectRatio);
        this._scaleFactor = new BABYLON.Vector2(.5 * (1 / this._postProcessScaleFactor), .5 * (1 / this._postProcessScaleFactor) * this.aspectRatio);
        this._lensCenter = new BABYLON.Vector2(this._isRightEye ? 0.5 - this._lensCenterOffset * 0.5 : 0.5 + this._lensCenterOffset * 0.5, 0.5);
    };
    BABYLON.OculusDistortionCorrectionPostProcess.prototype.onApply = function (effect) {
        effect.setFloat2("LensCenter", this._lensCenter.x, this._lensCenter.y);
        effect.setFloat2("Scale", this._scaleFactor.x, this._scaleFactor.y);
        effect.setFloat2("ScaleIn", this._scaleIn.x, this._scaleIn.y);
        effect.setFloat4("HmdWarpParam", this._distortionFactors[0], this._distortionFactors[1], this._distortionFactors[2], this._distortionFactors[3]);
    };
})();
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
(function (BABYLON) {
    var VirtualJoystick = (function () {
        var vjCanvas, vjCanvasContext, vjCanvasWidth, vjCanvasHeight, halfWidth, halfHeight;
        var globalJoystickIndex = 0;

        function VirtualJoystick(leftJoystick) {
            if (leftJoystick) {
                this._leftJoystick = true;
            } else {
                this._leftJoystick = false;
            }
            this.joystickIndex = globalJoystickIndex;
            globalJoystickIndex++;
            this._axisTargetedByLeftAndRight = "X";
            this._axisTargetedByUpAndDown = "Y";
            this.reverseLeftRight = false;
            this.reverseUpDown = false;
            this._touches = new BABYLON.VirtualJoystick.Collection();
            this.deltaPosition = BABYLON.Vector3.Zero();
            this._joystickSensibility = 25;
            this._inversedSensibility = 1 / (this._joystickSensibility / 1000);
            this._rotationSpeed = 25;
            this._inverseRotationSpeed = 1 / (this._rotationSpeed / 1000);
            this._rotateOnAxisRelativeToMesh = false;
            var that = this;
            if (!vjCanvas) {
                window.addEventListener("resize", function () {
                    vjCanvasWidth = window.innerWidth;
                    vjCanvasHeight = window.innerHeight;
                    vjCanvas.width = vjCanvasWidth;
                    vjCanvas.height = vjCanvasHeight;
                    halfWidth = vjCanvasWidth / 2;
                    halfHeight = vjCanvasHeight / 2;
                }, false);
                vjCanvas = document.createElement("canvas");
                vjCanvasWidth = window.innerWidth;
                vjCanvasHeight = window.innerHeight;
                vjCanvas.width = window.innerWidth;
                vjCanvas.height = window.innerHeight;
                vjCanvas.style.width = "100%";
                vjCanvas.style.height = "100%";
                vjCanvas.style.position = "absolute";
                vjCanvas.style.backgroundColor = "transparent";
                vjCanvas.style.top = "0px";
                vjCanvas.style.left = "0px";
                vjCanvas.style.zIndex = 5;
                vjCanvas.style.msTouchAction = "none";
                vjCanvasContext = vjCanvas.getContext('2d');
                vjCanvasContext.strokeStyle = "#ffffff";
                vjCanvasContext.lineWidth = 2;
                document.body.appendChild(vjCanvas);
            }
            halfWidth = vjCanvas.width / 2;
            halfHeight = vjCanvas.height / 2;
            this.pressed = false;
            this._joystickColor = "cyan";
            this.joystickPointerID = -1;
            this.joystickPointerPos = new BABYLON.Vector2(0, 0);
            this.joystickPointerStartPos = new BABYLON.Vector2(0, 0);
            this.deltaJoystickVector = new BABYLON.Vector2(0, 0);
            vjCanvas.addEventListener('pointerdown', function (evt) {
                that.onPointerDown(evt);
            }, false);
            vjCanvas.addEventListener('pointermove', function (evt) {
                that.onPointerMove(evt);
            }, false);
            vjCanvas.addEventListener('pointerup', function (evt) {
                that.onPointerUp(evt);
            }, false);
            vjCanvas.addEventListener('pointerout', function (evt) {
                that.onPointerUp(evt);
            }, false);
            vjCanvas.addEventListener("contextmenu", function (e) {
                e.preventDefault();
            }, false);
            requestAnimationFrame(function () {
                that.drawVirtualJoystick();
            });
        }
        VirtualJoystick.prototype.setJoystickSensibility = function (newJoystickSensibility) {
            this._joystickSensibility = newJoystickSensibility;
            this._inversedSensibility = 1 / (this._joystickSensibility / 1000);
        };
        VirtualJoystick.prototype.onPointerDown = function (e) {
            e.preventDefault();
            var newPointer = {
                identifier: e.pointerId,
                x: e.clientX,
                y: e.clientY,
                type: this.givePointerType(e)
            };
            var positionOnScreenCondition;
            if (this._leftJoystick === true) {
                positionOnScreenCondition = (e.clientX < halfWidth);
            } else {
                positionOnScreenCondition = (e.clientX > halfWidth);
            } if (positionOnScreenCondition && this.joystickPointerID < 0) {
                this.joystickPointerID = e.pointerId;
                this.joystickPointerStartPos.x = e.clientX;
                this.joystickPointerStartPos.y = e.clientY;
                this.joystickPointerPos = this.joystickPointerStartPos.clone();
                this.deltaJoystickVector.x = 0;
                this.deltaJoystickVector.y = 0;
                this.pressed = true;
                this._touches.add(e.pointerId, newPointer);
            } else {
                if (globalJoystickIndex < 2 && this._action) {
                    this._action();
                    this._touches.add(e.pointerId, newPointer);
                }
            }
        };
        VirtualJoystick.prototype.onPointerMove = function (e) {
            if (this.joystickPointerID == e.pointerId) {
                this.joystickPointerPos.x = e.clientX;
                this.joystickPointerPos.y = e.clientY;
                this.deltaJoystickVector = this.joystickPointerPos.clone();
                this.deltaJoystickVector = this.deltaJoystickVector.subtract(this.joystickPointerStartPos);
                var directionLeftRight = this.reverseLeftRight ? -1 : 1;
                var deltaJoystickX = directionLeftRight * this.deltaJoystickVector.x / this._inversedSensibility;
                switch (this._axisTargetedByLeftAndRight) {
                case "X":
                    this.deltaPosition.x = Math.min(1, Math.max(-1, deltaJoystickX));
                    break;
                case "Y":
                    this.deltaPosition.y = Math.min(1, Math.max(-1, deltaJoystickX));
                    break;
                case "Z":
                    this.deltaPosition.z = Math.min(1, Math.max(-1, deltaJoystickX));
                    break;
                }
                var directionUpDown = this.reverseUpDown ? 1 : -1;
                var deltaJoystickY = directionUpDown * this.deltaJoystickVector.y / this._inversedSensibility;
                switch (this._axisTargetedByUpAndDown) {
                case "X":
                    this.deltaPosition.x = Math.min(1, Math.max(-1, deltaJoystickY));
                    break;
                case "Y":
                    this.deltaPosition.y = Math.min(1, Math.max(-1, deltaJoystickY));
                    break;
                case "Z":
                    this.deltaPosition.z = Math.min(1, Math.max(-1, deltaJoystickY));
                    break;
                }
            } else {
                if (this._touches.item(e.pointerId)) {
                    this._touches.item(e.pointerId).x = e.clientX;
                    this._touches.item(e.pointerId).y = e.clientY;
                }
            }
        };
        VirtualJoystick.prototype.onPointerUp = function (e) {
            if (this.joystickPointerID == e.pointerId) {
                this.joystickPointerID = -1;
                this.pressed = false;
            }
            this.deltaJoystickVector.x = 0;
            this.deltaJoystickVector.y = 0;
            this._touches.remove(e.pointerId);
        };
        VirtualJoystick.prototype.setJoystickColor = function (newColor) {
            this._joystickColor = newColor;
        };
        VirtualJoystick.prototype.setActionOnTouch = function (action) {
            this._action = action;
        };
        VirtualJoystick.prototype.setAxisForLR = function (axisLetter) {
            switch (axisLetter) {
            case "X":
            case "Y":
            case "Z":
                this._axisTargetedByLeftAndRight = axisLetter;
                break;
            default:
                this._axisTargetedByLeftAndRight = "X";
                break;
            }
        };
        VirtualJoystick.prototype.setAxisForUD = function (axisLetter) {
            switch (axisLetter) {
            case "X":
            case "Y":
            case "Z":
                this._axisTargetedByUpAndDown = axisLetter;
                break;
            default:
                this._axisTargetedByUpAndDown = "Y";
                break;
            }
        };
        VirtualJoystick.prototype.drawVirtualJoystick = function () {
            var that = this;
            if (that._leftJoystick) {
                vjCanvasContext.clearRect(0, 0, vjCanvasWidth / 2, vjCanvasHeight);
            } else {
                vjCanvasContext.clearRect(vjCanvasWidth / 2, 0, vjCanvasWidth, vjCanvasHeight);
            }
            this._touches.forEach(function (touch) {
                if (touch.identifier === that.joystickPointerID) {
                    vjCanvasContext.beginPath();
                    vjCanvasContext.strokeStyle = that._joystickColor;
                    vjCanvasContext.lineWidth = 6;
                    vjCanvasContext.arc(that.joystickPointerStartPos.x, that.joystickPointerStartPos.y, 40, 0, Math.PI * 2, true);
                    vjCanvasContext.stroke();
                    vjCanvasContext.beginPath();
                    vjCanvasContext.strokeStyle = that._joystickColor;
                    vjCanvasContext.lineWidth = 2;
                    vjCanvasContext.arc(that.joystickPointerStartPos.x, that.joystickPointerStartPos.y, 60, 0, Math.PI * 2, true);
                    vjCanvasContext.stroke();
                    vjCanvasContext.beginPath();
                    vjCanvasContext.strokeStyle = that._joystickColor;
                    vjCanvasContext.arc(that.joystickPointerPos.x, that.joystickPointerPos.y, 40, 0, Math.PI * 2, true);
                    vjCanvasContext.stroke();
                } else {
                    vjCanvasContext.beginPath();
                    vjCanvasContext.fillStyle = "white";
                    vjCanvasContext.beginPath();
                    vjCanvasContext.strokeStyle = "red";
                    vjCanvasContext.lineWidth = "6";
                    vjCanvasContext.arc(touch.x, touch.y, 40, 0, Math.PI * 2, true);
                    vjCanvasContext.stroke();
                };
            });
            requestAnimationFrame(function () {
                that.drawVirtualJoystick();
            });
        };
        VirtualJoystick.prototype.givePointerType = function (event) {
            switch (event.pointerType) {
            case event.POINTER_TYPE_MOUSE:
                return "MOUSE";
                break;
            case event.POINTER_TYPE_PEN:
                return "PEN";
                break;
            case event.POINTER_TYPE_TOUCH:
                return "TOUCH";
                break;
            }
        };
        VirtualJoystick.prototype.releaseCanvas = function () {
            if (vjCanvas) {
                document.body.removeChild(vjCanvas);
                vjCanvas = null;
            };
        };
        return VirtualJoystick;
    })();
    BABYLON.VirtualJoystick = VirtualJoystick;
    var Collection = (function () {
        function Collection() {
            this.count = 0;
            this.collection = {};
        };
        Collection.prototype.add = function (key, item) {
            if (this.collection[key] != undefined) {
                return undefined;
            }
            this.collection[key] = item;
            return ++this.count;
        };
        Collection.prototype.remove = function (key) {
            if (this.collection[key] == undefined) {
                return undefined;
            }
            delete this.collection[key];
            return --this.count;
        };
        Collection.prototype.item = function (key) {
            return this.collection[key];
        };
        Collection.prototype.forEach = function (block) {
            var key;
            for (key in this.collection) {
                if (this.collection.hasOwnProperty(key)) {
                    block(this.collection[key]);
                }
            }
        };
        return Collection;
    })();
    BABYLON.VirtualJoystick.Collection = Collection;
})(BABYLON || (BABYLON = {}));
var BABYLON = BABYLON || {};
(function () {
    BABYLON.OculusOrientedCamera = function (name, position, scene, isLeftEye, ovrSettings, neutralOrientation) {
        position = position ? new BABYLON.Vector3(position.x, position.y, position.z) : null;
        BABYLON.Camera.call(this, name, position, scene);
        this._referenceDirection = new BABYLON.Vector3(0, 0, 1);
        this._referenceUp = new BABYLON.Vector3(0, 1, 0);
        this._actualDirection = new BABYLON.Vector3(1, 0, 0);
        this._actualUp = new BABYLON.Vector3(0, 1, 0);
        this._currentTargetPoint = new BABYLON.Vector3(0, 0, 0);
        this._currentOrientation = Object.create(neutralOrientation || {
            yaw: 0.0,
            pitch: 0.0,
            roll: 0.0
        });
        this._currentViewMatrix = new BABYLON.Matrix();
        this._currentOrientationMatrix = new BABYLON.Matrix();
        this._currentInvertOrientationMatrix = new BABYLON.Matrix();
        this._tempMatrix = new BABYLON.Matrix();
        if (isLeftEye) {
            this.viewport = new BABYLON.Viewport(0, 0, 0.5, 1.0);
        } else {
            this.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 1.0);
        }
        this._aspectRatioAspectRatio = ovrSettings.HResolution / (2 * ovrSettings.VResolution);
        this._aspectRatioFov = (2 * Math.atan((ovrSettings.PostProcessScaleFactor * ovrSettings.VScreenSize) / (2 * ovrSettings.EyeToScreenDistance)));
        var hMeters = (ovrSettings.HScreenSize / 4) - (ovrSettings.LensSeparationDistance / 2);
        var h = (4 * hMeters) / ovrSettings.HScreenSize;
        this._hMatrix = BABYLON.Matrix.Translation(isLeftEye ? h : -h, 0, 0);
        this._projectionMatrix = new BABYLON.Matrix();
        this._preViewMatrix = BABYLON.Matrix.Translation(isLeftEye ? .5 * ovrSettings.InterpupillaryDistance : -.5 * ovrSettings.InterpupillaryDistance, 0, 0);
        new BABYLON.OculusDistortionCorrectionPostProcess("Oculus Distortion", this, !isLeftEye, ovrSettings);
        this.resetProjectionMatrix();
        this.resetViewMatrix();
    };
    BABYLON.OculusOrientedCamera.BuildOculusStereoCamera = function (scene, name, minZ, maxZ, position, neutralOrientation, useFXAA, disableGravity, disableCollisions, collisionEllipsoid, ovrSettings) {
        var canvas = scene.getEngine().getRenderingCanvas();
        position = position || BABYLON.Vector3.Zero(0, 0, 0);
        neutralOrientation = neutralOrientation || {
            yaw: 0.0,
            pitch: 0.0,
            roll: 0.0
        };
        ovrSettings = ovrSettings || BABYLON.OculusController.CameraSettings_OculusRiftDevKit2013_Metric;
        var leftCamera = new BABYLON.OculusOrientedCamera(name + "_left", position, scene, true, ovrSettings, neutralOrientation);
        leftCamera.minZ = minZ;
        leftCamera.maxZ = maxZ;
        if (useFXAA) {
            new BABYLON.FxaaPostProcess("fxaa_left", 1.0, leftCamera);
        }
        var rightCamera = new BABYLON.OculusOrientedCamera(name + "_right", position, scene, false, ovrSettings, neutralOrientation);
        rightCamera.minZ = minZ;
        rightCamera.maxZ = maxZ;
        if (useFXAA) {
            new BABYLON.FxaaPostProcess("fxaa_right", 1.0, rightCamera);
        }
        scene.activeCameras = [];
        scene.activeCameras.push(leftCamera);
        scene.activeCameras.push(rightCamera);
        leftCamera.attachControl(canvas);
        rightCamera.attachControl(canvas);
        var multiTarget = new BABYLON.InputControllerMultiTarget([leftCamera, rightCamera]);
        var controller = new BABYLON.OculusController(scene, multiTarget);
        var moveTarget = multiTarget;
        if (!disableCollisions) {
            var collisionFilter = new BABYLON.InputCollisionFilter(scene, multiTarget, collisionEllipsoid);
            moveTarget = collisionFilter;
        }
        if (!disableGravity) {
            var globalAxisFactorFilter = new BABYLON.GlobalAxisFactorsFilter(scene, moveTarget, 1, 0, 1);
            var gravityController = new BABYLON.GravityInputController(scene, moveTarget);
            moveTarget = globalAxisFactorFilter;
        }
        var moveController = new BABYLON.KeyboardMoveController(scene, moveTarget);
        moveController.attachToCanvas(canvas);
        var result = {
            leftCamera: leftCamera,
            rightCamera: rightCamera,
            intermediateControllerTarget: multiTarget,
            oculusController: controller,
            keyboardController: moveController
        };
        result.dispose = function () {
            this.leftCamera.detachControl(canvas);
            this.rightCamera.detachControl(canvas);
            this.leftCamera.dispose();
            this.rightCamera.dispose();
            this.oculusController.dispose();
            this.keyboardController.detachFromCanvas(canvas);
            this.keyboardController.dispose();
        }.bind(result);
        return result;
    };
    BABYLON.OculusOrientedCamera.prototype = Object.create(BABYLON.Camera.prototype);
    BABYLON.OculusOrientedCamera.prototype.resetViewMatrix = function () {
        BABYLON.Matrix.RotationYawPitchRollToRef(this._currentOrientation.yaw, this._currentOrientation.pitch, -this._currentOrientation.roll, this._currentOrientationMatrix);
        this._currentOrientationMatrix.invertToRef(this._currentInvertOrientationMatrix);
        BABYLON.Vector3.TransformNormalToRef(this._referenceDirection, this._currentOrientationMatrix, this._actualDirection);
        BABYLON.Vector3.TransformNormalToRef(this._referenceUp, this._currentOrientationMatrix, this._actualUp);
        BABYLON.Vector3.FromFloatsToRef(this.position.x + this._actualDirection.x, this.position.y + this._actualDirection.y, this.position.z + this._actualDirection.z, this._currentTargetPoint);
        BABYLON.Matrix.LookAtLHToRef(this.position, this._currentTargetPoint, this._actualUp, this._tempMatrix);
        this._tempMatrix.multiplyToRef(this._preViewMatrix, this._currentViewMatrix);
        return this._currentViewMatrix;
    };
    BABYLON.OculusOrientedCamera.prototype.getViewMatrix = function () {
        return this._currentViewMatrix;
    };
    BABYLON.OculusOrientedCamera.prototype._update = function () {
        if (this.controllers) {
            for (var i = 0; i < this.controllers.length; ++i) {
                this.controllers[i].update();
            }
        }
    };
    BABYLON.OculusOrientedCamera.prototype.getOrientationMatrix = function () {
        return this._currentOrientationMatrix;
    };
    BABYLON.OculusOrientedCamera.prototype.getInvertOrientationMatrix = function () {
        return this._currentInvertOrientationMatrix;
    };
    BABYLON.OculusOrientedCamera.prototype.resetProjectionMatrix = function () {
        BABYLON.Matrix.PerspectiveFovLHToRef(this._aspectRatioFov, this._aspectRatioAspectRatio, this.minZ, this.maxZ, this._tempMatrix);
        this._tempMatrix.multiplyToRef(this._hMatrix, this._projectionMatrix);
        return this._projectionMatrix;
    };
    BABYLON.OculusOrientedCamera.prototype.getProjectionMatrix = function (force) {
        return this._projectionMatrix;
    };
    BABYLON.OculusOrientedCamera.prototype.getOrientation = function () {
        return this._currentOrientation;
    };
    BABYLON.OculusOrientedCamera.prototype.getPosition = function () {
        return this.position;
    };
    BABYLON.OculusOrientedCamera.prototype.moveRelative = function (movementVector) {
        if (!this._tempMoveVector) {
            this._tempMoveVector = new BABYLON.Vector3(0, 0, 0);
        }
        BABYLON.Vector3.TransformNormalToRef(movementVector, this._currentOrientationMatrix, this._tempMoveVector);
        this.position.addInPlace(this._tempMoveVector);
        this.resetViewMatrix();
    };
    BABYLON.OculusOrientedCamera.prototype.rotateRelative = function (rotation) {
        this._currentOrientation.yaw += rotation.yaw;
        this._currentOrientation.pitch += rotation.pitch;
        this._currentOrientation.roll += rotation.roll;
        this.resetViewMatrix();
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.VirtualJoysticksCamera = function (name, position, scene) {
        BABYLON.FreeCamera.call(this, name, position, scene);
        this.leftjoystick = new BABYLON.VirtualJoystick(true);
        this.leftjoystick.setAxisForUD("Z");
        this.leftjoystick.setAxisForLR("X");
        this.leftjoystick.setJoystickSensibility(0.15);
        this.rightjoystick = new BABYLON.VirtualJoystick(false);
        this.rightjoystick.setAxisForUD("X");
        this.rightjoystick.setAxisForLR("Y");
        this.rightjoystick.reverseUpDown = true;
        this.rightjoystick.setJoystickSensibility(0.05);
        this.rightjoystick.setJoystickColor("yellow");
    };
    BABYLON.VirtualJoysticksCamera.prototype = Object.create(BABYLON.FreeCamera.prototype);
    BABYLON.VirtualJoysticksCamera.prototype._checkInputs = function () {
        var cameraTransform = BABYLON.Matrix.RotationYawPitchRoll(this.rotation.y, this.rotation.x, 0);
        var deltaTransform = BABYLON.Vector3.TransformCoordinates(this.leftjoystick.deltaPosition, cameraTransform);
        this.cameraDirection = this.cameraDirection.add(deltaTransform);
        this.cameraRotation = this.cameraRotation.add(this.rightjoystick.deltaPosition);
        if (!this.leftjoystick.pressed) {
            this.leftjoystick.deltaPosition = this.leftjoystick.deltaPosition.scale(0.9);
        }
        if (!this.rightjoystick.pressed) {
            this.rightjoystick.deltaPosition = this.rightjoystick.deltaPosition.scale(0.9);
        }
    };
    BABYLON.VirtualJoysticksCamera.prototype.dispose = function () {
        this.leftjoystick.releaseCanvas();
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.KeyboardMoveController = function (scene, target) {
        BABYLON.InputController.call(this, scene, target);
        this._keys = [];
        this.keysUp = [38];
        this.keysDown = [40];
        this.keysLeft = [37];
        this.keysRight = [39];
        this._currentSpeed = new BABYLON.Vector3(0, 0, 0);
        this._lastFrameSpeed = new BABYLON.Vector3(0, 0, 0);
        this._currentAcceleration = new BABYLON.Vector3(0, 0, 0);
        this._tempSpeed = new BABYLON.Vector3(0, 0, 0);
        this._tempSpeed2 = new BABYLON.Vector3(0, 0, 0);
        this.maxAbsoluteSpeed = 2;
        this.maxAbsoluteAcceleration = 5;
        this._targetSpeed = new BABYLON.Vector3(0, 0, 0);
    };
    BABYLON.KeyboardMoveController.prototype = Object.create(BABYLON.InputController.prototype);
    BABYLON.KeyboardMoveController.prototype.attachToCanvas = function (canvas) {
        var that = this;
        this._canvas = canvas;
        this._onKeyDown = function (evt) {
            if (that.keysUp.indexOf(evt.keyCode) !== -1 || that.keysDown.indexOf(evt.keyCode) !== -1 || that.keysLeft.indexOf(evt.keyCode) !== -1 || that.keysRight.indexOf(evt.keyCode) !== -1) {
                var index = that._keys.indexOf(evt.keyCode);
                if (index === -1) {
                    that._keys.push(evt.keyCode);
                }
            }
        };
        this._onKeyUp = function (evt) {
            if (that.keysUp.indexOf(evt.keyCode) !== -1 || that.keysDown.indexOf(evt.keyCode) !== -1 || that.keysLeft.indexOf(evt.keyCode) !== -1 || that.keysRight.indexOf(evt.keyCode) !== -1) {
                var index = that._keys.indexOf(evt.keyCode);
                if (index >= 0) {
                    that._keys.splice(index, 1);
                }
            }
        };
        this._onLostFocus = function () {
            that._keys = [];
        };
        window.addEventListener("keydown", this._onKeyDown, false);
        window.addEventListener("keyup", this._onKeyUp, false);
        window.addEventListener("blur", this._onLostFocus, false);
    };
    BABYLON.KeyboardMoveController.prototype.detachFromCanvas = function (canvas) {
        window.removeEventListener("keydown", this._onKeyDown, false);
        window.removeEventListener("keyup", this._onKeyUp, false);
        window.removeEventListener("blur", this._onLostFocus, false);
    };
    BABYLON.KeyboardMoveController.prototype.updateCurrentSpeed = function () {
        this._lastFrameSpeed.x = this._currentSpeed.x;
        this._lastFrameSpeed.y = this._currentSpeed.y;
        this._lastFrameSpeed.z = this._currentSpeed.z;
        if (this._currentSpeed.equals(this._targetSpeed)) {
            this._currentAcceleration.x = 0;
            this._currentAcceleration.y = 0;
            this._currentAcceleration.z = 0;
            return;
        }
        var dt = BABYLON.Tools.GetDeltaTime() / 1000.0;
        var dv = this._tempSpeed;
        this._targetSpeed.subtractToRef(this._lastFrameSpeed, dv);
        var absoluteAccToTarget = dv.length() / dt;
        if (absoluteAccToTarget < this.maxAbsoluteAcceleration) {
            this._currentSpeed.x = this._targetSpeed.x;
            this._currentSpeed.y = this._targetSpeed.y;
            this._currentSpeed.z = this._targetSpeed.z;
            dv.normalize();
            dv.scaleToRef(absoluteAccToTarget, this._currentAcceleration);
        } else {
            dv.normalize();
            dv.scaleToRef(this.maxAbsoluteAcceleration, this._currentAcceleration);
            dv.scaleInPlace(this.maxAbsoluteAcceleration * dt);
            this._currentSpeed.addInPlace(dv);
        }
    };
    BABYLON.KeyboardMoveController.prototype.update = function () {
        this._targetSpeed.x = 0;
        this._targetSpeed.y = 0;
        this._targetSpeed.z = 0;
        for (var index = 0; index < this._keys.length; index++) {
            var keyCode = this._keys[index];
            if (this.keysLeft.indexOf(keyCode) !== -1) {
                this._targetSpeed.x -= 1;
            } else if (this.keysUp.indexOf(keyCode) !== -1) {
                this._targetSpeed.z += 1;
            } else if (this.keysRight.indexOf(keyCode) !== -1) {
                this._targetSpeed.x += 1;
            } else if (this.keysDown.indexOf(keyCode) !== -1) {
                this._targetSpeed.z -= 1;
            }
        }
        if (this._targetSpeed.x != 0 || this._targetSpeed.z != 0) {
            this._targetSpeed.normalize();
            this._targetSpeed.scaleInPlace(this.maxAbsoluteSpeed);
        }
        this.updateCurrentSpeed();
        if (this._lastFrameSpeed.x == 0 && this._lastFrameSpeed.z == 0 && this._currentAcceleration.x == 0 && this._currentAcceleration.z == 0) {
            return;
        }
        var dt = BABYLON.Tools.GetDeltaTime() / 1000.0;
        this._lastFrameSpeed.scaleToRef(dt, this._tempSpeed);
        this._currentAcceleration.scaleToRef(dt * dt * 0.5, this._tempSpeed2);
        this._tempSpeed.addInPlace(this._tempSpeed2);
        if (this._tempSpeed.x != 0 || this._tempSpeed.z != 0) {
            this.target.moveRelative(this._tempSpeed);
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.OculusController = function (scene, target) {
        BABYLON.InputController.call(this, scene, target);
        this._deviceOrientationHandler = this.onOrientationEvent.bind(this);
        this._tempOrientation = {
            yaw: 0.0,
            pitch: 0.0,
            roll: 0.0
        };
        this._relativeOrientation = {
            yaw: 0.0,
            pitch: 0.0,
            roll: 0.0
        };
        window.addEventListener("deviceorientation", this._deviceOrientationHandler);
    };
    BABYLON.OculusController.prototype = Object.create(BABYLON.InputController.prototype);
    BABYLON.OculusController.prototype.onOrientationEvent = function (ev) {
        this._tempOrientation.yaw = ev.alpha / 180 * Math.PI;
        this._tempOrientation.pitch = ev.beta / 180 * Math.PI;
        this._tempOrientation.roll = ev.gamma / 180 * Math.PI;
        if (!this._lastOrientation) {
            this._lastOrientation = Object.create(this._tempOrientation);
        } else {
            this._relativeOrientation.yaw = this._tempOrientation.yaw - this._lastOrientation.yaw;
            this._relativeOrientation.pitch = this._tempOrientation.pitch - this._lastOrientation.pitch;
            this._relativeOrientation.roll = this._tempOrientation.roll - this._lastOrientation.roll;
            var temp = this._tempOrientation;
            this._tempOrientation = this._lastOrientation;
            this._lastOrientation = temp;
            this.target.rotateRelative(this._relativeOrientation);
        }
    };
    BABYLON.OculusController.prototype.dispose = function () {
        window.removeEventListener("deviceorientation", this._deviceOrientationHandler);
    };
    BABYLON.OculusController.CameraSettings_OculusRiftDevKit2013_Metric = {
        HResolution: 1280,
        VResolution: 800,
        HScreenSize: 0.149759993,
        VScreenSize: 0.0935999975,
        VScreenCenter: 0.0467999987,
        EyeToScreenDistance: 0.0410000011,
        LensSeparationDistance: 0.0635000020,
        InterpupillaryDistance: 0.0640000030,
        DistortionK: [1.0, 0.219999999, 0.239999995, 0.0],
        ChromaAbCorrection: [0.995999992, -0.00400000019, 1.01400006, 0.0],
        PostProcessScaleFactor: 1.714605507808412,
        LensCenterOffset: 0.151976421
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.InputCollisionFilter = function (scene, target, ellipsoid) {
        BABYLON.inputFilter.call(this, scene, target);
        this._transformedDirection = new BABYLON.Vector3();
        this._tempNewPosition = new BABYLON.Vector3();
        this._tempNewPosition2 = new BABYLON.Vector3();
        this._ellipsoid = ellipsoid || new BABYLON.Vector3(.2, .855, .2);
        this._collider = new BABYLON.Collider();
        this._collidedPosition = new BABYLON.Vector3(0, 0, 0);
        this._cameraHeight = 1.7;
        this._positionBottom = new BABYLON.Vector3(0, 0, 0);
    };
    BABYLON.InputCollisionFilter.prototype = Object.create(BABYLON.inputFilter.prototype);
    BABYLON.InputCollisionFilter.prototype.moveRelative = function (relativeMovement) {
        var rotation = this.getOrientation();
        BABYLON.Vector3.TransformNormalToRef(relativeMovement, this.getOrientationMatrix(), this._transformedDirection);
        this.getPosition().addToRef(this._transformedDirection, this._tempNewPosition);
        this._collider.radius = this._ellipsoid;
        var p = this.getPosition();
        this._positionBottom.x = p.x;
        this._positionBottom.y = p.y;
        this._positionBottom.z = p.z;
        this._positionBottom.y += this._ellipsoid.y - this._cameraHeight;
        this.scene._getNewPosition(this._positionBottom, this._transformedDirection, this._collider, 3, this._collidedPosition);
        this._collidedPosition.subtractToRef(this._positionBottom, this._tempNewPosition2);
        if (this._tempNewPosition2.length() > BABYLON.Engine.collisionsEpsilon * 2) {
            BABYLON.Vector3.TransformNormalToRef(this._tempNewPosition2, this.getInvertOrientationMatrix(), this._tempNewPosition);
            this.target.moveRelative(this._tempNewPosition);
        }
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.GravityInputController = function (scene, target) {
        BABYLON.InputController.call(this, scene, target);
        this._moveVectorGlobal = new BABYLON.Vector3(0, 0, 0);
        this._moveVectorLocal = new BABYLON.Vector3(0, 0, 0);
        this._fallSpeed = 2;
    };
    BABYLON.GravityInputController.prototype = Object.create(BABYLON.InputController.prototype);
    BABYLON.GravityInputController.prototype.update = function () {
        this._moveVectorGlobal.x = 0;
        this._moveVectorGlobal.y = -this._fallSpeed * BABYLON.Tools.GetDeltaTime() / 1000.0;
        this._moveVectorGlobal.z = 0;
        BABYLON.Vector3.TransformNormalToRef(this._moveVectorGlobal, this.target.getInvertOrientationMatrix(), this._moveVectorLocal);
        this.target.moveRelative(this._moveVectorLocal);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.GlobalAxisFactorsFilter = function (scene, target, xFactor, yFactor, zFactor) {
        BABYLON.inputFilter.call(this, scene, target);
        this.xFactor = xFactor;
        this.yFactor = yFactor;
        this.zFactor = zFactor;
        this._globalMovement = new BABYLON.Vector3(0, 0, 0);
    };
    BABYLON.GlobalAxisFactorsFilter.prototype = Object.create(BABYLON.inputFilter.prototype);
    BABYLON.GlobalAxisFactorsFilter.prototype.moveRelative = function (relativeMovement) {
        var orientation = this.getOrientation();
        BABYLON.Vector3.TransformNormalToRef(relativeMovement, this.getOrientationMatrix(), this._globalMovement);
        this._globalMovement.x *= this.xFactor;
        this._globalMovement.y *= this.yFactor;
        this._globalMovement.z *= this.zFactor;
        BABYLON.Vector3.TransformNormalToRef(this._globalMovement, this.getInvertOrientationMatrix(), relativeMovement);
        this.target.moveRelative(relativeMovement);
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.ShaderMaterial = function (name, scene, shaderPath, options) {
        this.name = name;
        this.id = name;
        this._shaderPath = shaderPath;
        options.needAlphaBlending = options.needAlphaBlending || false;
        options.needAlphaTesting = options.needAlphaTesting || false;
        options.attributes = options.attributes || ["position", "normal", "uv"];
        options.uniforms = options.uniforms || ["worldViewProjection"];
        options.samplers = options.samplers || [];
        this._options = options;
        this._scene = scene;
        scene.materials.push(this);
        this._textures = [];
        this._floats = [];
        this._floatsArrays = [];
        this._colors3 = [];
        this._colors4 = [];
        this._vectors2 = [];
        this._vectors3 = [];
        this._vectors4 = [];
        this._matrices = [];
    };
    BABYLON.ShaderMaterial.prototype = Object.create(BABYLON.Material.prototype);
    BABYLON.ShaderMaterial.prototype.needAlphaBlending = function () {
        return this._options.needAlphaBlending;
    };
    BABYLON.ShaderMaterial.prototype.needAlphaTesting = function () {
        return this._options.needAlphaTesting;
    };
    BABYLON.ShaderMaterial.prototype._checkUniform = function (uniformName) {
        if (this._options.uniforms.indexOf(uniformName) === -1) {
            this._options.uniforms.push(uniformName);
        }
    };
    BABYLON.ShaderMaterial.prototype.setTexture = function (name, texture) {
        this._checkUniform(name);
        this._textures[name] = texture;
        return this;
    };
    BABYLON.ShaderMaterial.prototype.setFloat = function (name, value) {
        this._checkUniform(name);
        this._floats[name] = value;
        return this;
    };
    BABYLON.ShaderMaterial.prototype.setFloats = function (name, value) {
        this._checkUniform(name);
        this._floatsArrays[name] = value;
        return this;
    };
    BABYLON.ShaderMaterial.prototype.setColor3 = function (name, value) {
        this._checkUniform(name);
        this._colors3[name] = value;
        return this;
    };
    BABYLON.ShaderMaterial.prototype.setColor4 = function (name, value) {
        this._checkUniform(name);
        this._colors4[name] = value;
        return this;
    };
    BABYLON.ShaderMaterial.prototype.setVector2 = function (name, value) {
        this._checkUniform(name);
        this._vectors2[name] = value;
        return this;
    };
    BABYLON.ShaderMaterial.prototype.setVector3 = function (name, value) {
        this._checkUniform(name);
        this._vectors3[name] = value;
        return this;
    };
    BABYLON.ShaderMaterial.prototype.setVector4 = function (name, value) {
        this._checkUniform(name);
        this._vectors4[name] = value;
        return this;
    };
    BABYLON.ShaderMaterial.prototype.setMatrix = function (name, value) {
        this._checkUniform(name);
        this._matrices[name] = value;
        return this;
    };
    BABYLON.ShaderMaterial.prototype.isReady = function (mesh) {
        var engine = this._scene.getEngine();
        this._effect = engine.createEffect(this._shaderPath, this._options.attributes, this._options.uniforms, this._options.samplers, "");
        if (!this._effect.isReady()) {
            return false;
        }
        return true;
    };
    BABYLON.ShaderMaterial.prototype.bind = function (world, mesh) {
        if (this._options.uniforms.indexOf("world") !== -1) {
            this._effect.setMatrix("world", world);
        }
        if (this._options.uniforms.indexOf("view") !== -1) {
            this._effect.setMatrix("view", this._scene.getViewMatrix());
        }
        if (this._options.uniforms.indexOf("projection") !== -1) {
            this._effect.setMatrix("projection", this._scene.getProjectionMatrix());
        }
        if (this._options.uniforms.indexOf("worldViewProjection") !== -1) {
            this._effect.setMatrix("worldViewProjection", world.multiply(this._scene.getTransformMatrix()));
        }
        for (var name in this._textures) {
            this._effect.setTexture(name, this._textures[name]);
        }
        for (name in this._floats) {
            this._effect.setFloat(name, this._floats[name]);
        }
        for (name in this._floatsArrays) {
            this._effect.setArray(name, this._floatsArrays[name]);
        }
        for (name in this._colors3) {
            this._effect.setColor3(name, this._colors3[name]);
        }
        for (name in this._colors4) {
            this._effect.setColor4(name, this._colors4[name]);
        }
        for (name in this._vectors2) {
            this._effect.setVector2(name, this._vectors2[name]);
        }
        for (name in this._vectors3) {
            this._effect.setVector3(name, this._vectors3[name]);
        }
        for (name in this._vectors4) {
            this._effect.setVector4(name, this._vectors4[name]);
        }
        for (name in this._matrices) {
            this._effect.setMatrix(name, this._matrices[name]);
        }
    };
    BABYLON.ShaderMaterial.prototype.dispose = function () {
        for (var name in this._textures) {
            this._textures[name].dispose();
        }
        this._textures = [];
        this.baseDispose();
    };
})();
var BABYLON = BABYLON || {};
(function () {
    BABYLON.VertexData = function () {};
    BABYLON.VertexData.prototype.applyToMesh = function (mesh, updatable) {
        if (this.positions) {
            mesh.setVerticesData(this.positions, BABYLON.VertexBuffer.PositionKind, updatable);
        }
        if (this.normals) {
            mesh.setVerticesData(this.normals, BABYLON.VertexBuffer.NormalKind, updatable);
        }
        if (this.uvs) {
            mesh.setVerticesData(this.uvs, BABYLON.VertexBuffer.UVKind, updatable);
        }
        if (this.indices) {
            mesh.setIndices(this.indices);
        }
    };
    BABYLON.VertexData.prototype.transform = function (matrix) {
        var transformed = BABYLON.Vector3.Zero();
        if (this.positions) {
            var position = BABYLON.Vector3.Zero();
            for (var index = 0; index < this.positions.length; index += 3) {
                BABYLON.Vector3.FromArrayToRef(this.positions, index, position);
                BABYLON.Vector3.TransformCoordinatesToRef(position, matrix, transformed);
                this.positions[index] = transformed.x;
                this.positions[index + 1] = transformed.y;
                this.positions[index + 2] = transformed.z;
            }
        }
        if (this.normals) {
            var normal = BABYLON.Vector3.Zero();
            for (index = 0; index < this.normals.length; index += 3) {
                BABYLON.Vector3.FromArrayToRef(this.normals, index, normal);
                BABYLON.Vector3.TransformNormalToRef(normal, matrix, transformed);
                this.normals[index] = transformed.x;
                this.normals[index + 1] = transformed.y;
                this.normals[index + 2] = transformed.z;
            }
        }
    };
    BABYLON.VertexData.prototype.merge = function (other) {
        if (other.indices) {
            if (!this.indices) {
                this.indices = [];
            }
            var offset = this.positions ? this.positions.length / 3 : 0;
            for (var index = 0; index < other.indices.length; index++) {
                this.indices.push(other.indices[index] + offset);
            }
        }
        if (other.positions) {
            if (!this.positions) {
                this.positions = [];
            }
            for (index = 0; index < other.positions.length; index++) {
                this.positions.push(other.positions[index]);
            }
        }
        if (other.normals) {
            if (!this.normals) {
                this.normals = [];
            }
            for (index = 0; index < other.normals.length; index++) {
                this.normals.push(other.normals[index]);
            }
        }
        if (other.uvs) {
            if (!this.uvs) {
                this.uvs = [];
            }
            for (index = 0; index < other.uvs.length; index++) {
                this.uvs.push(other.uvs[index]);
            }
        }
    };
    BABYLON.VertexData.CreateBox = function (size) {
        var normalsSource = [new BABYLON.Vector3(0, 0, 1), new BABYLON.Vector3(0, 0, -1), new BABYLON.Vector3(1, 0, 0), new BABYLON.Vector3(-1, 0, 0), new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, -1, 0)];
        var indices = [];
        var positions = [];
        var normals = [];
        var uvs = [];
        for (var index = 0; index < normalsSource.length; index++) {
            var normal = normalsSource[index];
            var side1 = new BABYLON.Vector3(normal.y, normal.z, normal.x);
            var side2 = BABYLON.Vector3.Cross(normal, side1);
            var verticesLength = positions.length / 3;
            indices.push(verticesLength);
            indices.push(verticesLength + 1);
            indices.push(verticesLength + 2);
            indices.push(verticesLength);
            indices.push(verticesLength + 2);
            indices.push(verticesLength + 3);
            var vertex = normal.subtract(side1).subtract(side2).scale(size / 2);
            positions.push(vertex.x, vertex.y, vertex.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(1.0, 1.0);
            vertex = normal.subtract(side1).add(side2).scale(size / 2);
            positions.push(vertex.x, vertex.y, vertex.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(0.0, 1.0);
            vertex = normal.add(side1).add(side2).scale(size / 2);
            positions.push(vertex.x, vertex.y, vertex.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(0.0, 0.0);
            vertex = normal.add(side1).subtract(side2).scale(size / 2);
            positions.push(vertex.x, vertex.y, vertex.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(1.0, 0.0);
        }
        var vertexData = new BABYLON.VertexData();
        vertexData.indices = indices;
        vertexData.positions = positions;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        return vertexData;
    };
    BABYLON.VertexData.CreateSphere = function (segments, diameter) {
        var radius = diameter / 2;
        var totalZRotationSteps = 2 + segments;
        var totalYRotationSteps = 2 * totalZRotationSteps;
        var indices = [];
        var positions = [];
        var normals = [];
        var uvs = [];
        for (var zRotationStep = 0; zRotationStep <= totalZRotationSteps; zRotationStep++) {
            var normalizedZ = zRotationStep / totalZRotationSteps;
            var angleZ = (normalizedZ * Math.PI);
            for (var yRotationStep = 0; yRotationStep <= totalYRotationSteps; yRotationStep++) {
                var normalizedY = yRotationStep / totalYRotationSteps;
                var angleY = normalizedY * Math.PI * 2;
                var rotationZ = BABYLON.Matrix.RotationZ(-angleZ);
                var rotationY = BABYLON.Matrix.RotationY(angleY);
                var afterRotZ = BABYLON.Vector3.TransformCoordinates(BABYLON.Vector3.Up(), rotationZ);
                var complete = BABYLON.Vector3.TransformCoordinates(afterRotZ, rotationY);
                var vertex = complete.scale(radius);
                var normal = BABYLON.Vector3.Normalize(vertex);
                positions.push(vertex.x, vertex.y, vertex.z);
                normals.push(normal.x, normal.y, normal.z);
                uvs.push(normalizedZ, normalizedY);
            }
            if (zRotationStep > 0) {
                var verticesCount = positions.length / 3;
                for (var firstIndex = verticesCount - 2 * (totalYRotationSteps + 1);
                    (firstIndex + totalYRotationSteps + 2) < verticesCount; firstIndex++) {
                    indices.push((firstIndex));
                    indices.push((firstIndex + 1));
                    indices.push(firstIndex + totalYRotationSteps + 1);
                    indices.push((firstIndex + totalYRotationSteps + 1));
                    indices.push((firstIndex + 1));
                    indices.push((firstIndex + totalYRotationSteps + 2));
                }
            }
        }
        var vertexData = new BABYLON.VertexData();
        vertexData.indices = indices;
        vertexData.positions = positions;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        return vertexData;
    };
    BABYLON.VertexData.CreateCylinder = function (height, diameterTop, diameterBottom, tessellation) {
        var radiusTop = diameterTop / 2;
        var radiusBottom = diameterBottom / 2;
        var indices = [];
        var positions = [];
        var normals = [];
        var uvs = [];
        var getCircleVector = function (i) {
            var angle = (i * 2.0 * Math.PI / tessellation);
            var dx = Math.sin(angle);
            var dz = Math.cos(angle);
            return new BABYLON.Vector3(dx, 0, dz);
        };
        var createCylinderCap = function (isTop) {
            var radius = isTop ? radiusTop : radiusBottom;
            if (radius == 0) {
                return;
            }
            for (var i = 0; i < tessellation - 2; i++) {
                var i1 = (i + 1) % tessellation;
                var i2 = (i + 2) % tessellation;
                if (!isTop) {
                    var tmp = i1;
                    var i1 = i2;
                    i2 = tmp;
                }
                var vbase = positions.length / 3;
                indices.push(vbase);
                indices.push(vbase + i1);
                indices.push(vbase + i2);
            }
            var normal = new BABYLON.Vector3(0, -1, 0);
            var textureScale = new BABYLON.Vector2(-0.5, -0.5);
            if (!isTop) {
                normal = normal.scale(-1);
                textureScale.x = -textureScale.x;
            }
            for (var i = 0; i < tessellation; i++) {
                var circleVector = getCircleVector(i);
                var position = circleVector.scale(radius).add(normal.scale(height));
                var textureCoordinate = new BABYLON.Vector2(circleVector.x * textureScale.x + 0.5, circleVector.z * textureScale.y + 0.5);
                positions.push(position.x, position.y, position.z);
                normals.push(normal.x, normal.y, normal.z);
                uvs.push(textureCoordinate.x, textureCoordinate.y);
            }
        };
        height /= 2;
        var topOffset = new BABYLON.Vector3(0, 1, 0).scale(height);
        var stride = tessellation + 1;
        for (var i = 0; i <= tessellation; i++) {
            var normal = getCircleVector(i);
            var sideOffsetBottom = normal.scale(radiusBottom);
            var sideOffsetTop = normal.scale(radiusTop);
            var textureCoordinate = new BABYLON.Vector2(i / tessellation, 0);
            var position = sideOffsetBottom.add(topOffset);
            positions.push(position.x, position.y, position.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(textureCoordinate.x, textureCoordinate.y);
            position = sideOffsetTop.subtract(topOffset);
            textureCoordinate.y += 1;
            positions.push(position.x, position.y, position.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(textureCoordinate.x, textureCoordinate.y);
            indices.push(i * 2);
            indices.push((i * 2 + 2) % (stride * 2));
            indices.push(i * 2 + 1);
            indices.push(i * 2 + 1);
            indices.push((i * 2 + 2) % (stride * 2));
            indices.push((i * 2 + 3) % (stride * 2));
        }
        createCylinderCap(true);
        createCylinderCap(false);
        var vertexData = new BABYLON.VertexData();
        vertexData.indices = indices;
        vertexData.positions = positions;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        return vertexData;
    };
    BABYLON.VertexData.CreateTorus = function (diameter, thickness, tessellation) {
        var indices = [];
        var positions = [];
        var normals = [];
        var uvs = [];
        var stride = tessellation + 1;
        for (var i = 0; i <= tessellation; i++) {
            var u = i / tessellation;
            var outerAngle = i * Math.PI * 2.0 / tessellation - Math.PI / 2.0;
            var transform = BABYLON.Matrix.Translation(diameter / 2.0, 0, 0).multiply(BABYLON.Matrix.RotationY(outerAngle));
            for (var j = 0; j <= tessellation; j++) {
                var v = 1 - j / tessellation;
                var innerAngle = j * Math.PI * 2.0 / tessellation + Math.PI;
                var dx = Math.cos(innerAngle);
                var dy = Math.sin(innerAngle);
                var normal = new BABYLON.Vector3(dx, dy, 0);
                var position = normal.scale(thickness / 2);
                var textureCoordinate = new BABYLON.Vector2(u, v);
                position = BABYLON.Vector3.TransformCoordinates(position, transform);
                normal = BABYLON.Vector3.TransformNormal(normal, transform);
                positions.push(position.x, position.y, position.z);
                normals.push(normal.x, normal.y, normal.z);
                uvs.push(textureCoordinate.x, textureCoordinate.y);
                var nextI = (i + 1) % stride;
                var nextJ = (j + 1) % stride;
                indices.push(i * stride + j);
                indices.push(i * stride + nextJ);
                indices.push(nextI * stride + j);
                indices.push(i * stride + nextJ);
                indices.push(nextI * stride + nextJ);
                indices.push(nextI * stride + j);
            }
        }
        var vertexData = new BABYLON.VertexData();
        vertexData.indices = indices;
        vertexData.positions = positions;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        return vertexData;
    };
    BABYLON.VertexData.CreateGround = function (width, height, subdivisions) {
        var indices = [];
        var positions = [];
        var normals = [];
        var uvs = [];
        var row, col;
        for (row = 0; row <= subdivisions; row++) {
            for (col = 0; col <= subdivisions; col++) {
                var position = new BABYLON.Vector3((col * width) / subdivisions - (width / 2.0), 0, ((subdivisions - row) * height) / subdivisions - (height / 2.0));
                var normal = new BABYLON.Vector3(0, 1.0, 0);
                positions.push(position.x, position.y, position.z);
                normals.push(normal.x, normal.y, normal.z);
                uvs.push(col / subdivisions, 1.0 - row / subdivisions);
            }
        }
        for (row = 0; row < subdivisions; row++) {
            for (col = 0; col < subdivisions; col++) {
                indices.push(col + 1 + (row + 1) * (subdivisions + 1));
                indices.push(col + 1 + row * (subdivisions + 1));
                indices.push(col + row * (subdivisions + 1));
                indices.push(col + (row + 1) * (subdivisions + 1));
                indices.push(col + 1 + (row + 1) * (subdivisions + 1));
                indices.push(col + row * (subdivisions + 1));
            }
        }
        var vertexData = new BABYLON.VertexData();
        vertexData.indices = indices;
        vertexData.positions = positions;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        return vertexData;
    };
    BABYLON.VertexData.CreatePlane = function (size) {
        var indices = [];
        var positions = [];
        var normals = [];
        var uvs = [];
        var halfSize = size / 2.0;
        positions.push(-halfSize, -halfSize, 0);
        normals.push(0, 0, -1.0);
        uvs.push(0.0, 0.0);
        positions.push(halfSize, -halfSize, 0);
        normals.push(0, 0, -1.0);
        uvs.push(1.0, 0.0);
        positions.push(halfSize, halfSize, 0);
        normals.push(0, 0, -1.0);
        uvs.push(1.0, 1.0);
        positions.push(-halfSize, halfSize, 0);
        normals.push(0, 0, -1.0);
        uvs.push(0.0, 1.0);
        indices.push(0);
        indices.push(1);
        indices.push(2);
        indices.push(0);
        indices.push(2);
        indices.push(3);
        var vertexData = new BABYLON.VertexData();
        vertexData.indices = indices;
        vertexData.positions = positions;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        return vertexData;
    };
})();