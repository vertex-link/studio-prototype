type ObjectType = "TORUS" | "CUBE"
interface SceneObject {
    id: string;
    children: SceneObject[];
    name: string;
    type: ObjectType;
}