import { z } from "zod";
const schema = z.object({
    gender: z.enum(["Male", "Female"]).optional(),
    age: z.number().min(18).max(100)
});
const incomingData = {
    gender: "Alien",
    age: 15
};
// safeParse does NOT throw an error. It returns an object with a 'success' boolean.
const result = schema.safeParse(incomingData);
if (!result.success) {
    console.log("❌ ZOD CAUGHT BAD DATA:");
    // .format() is a built-in Zod method that makes errors highly readable
    console.log(JSON.stringify(result.error.format(), null, 2));
}
else {
    console.log("✅ Data is perfectly valid!", result.data);
}
