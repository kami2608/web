import {
    Stack,
    Grid,
    FormControlLabel,
    Radio,
    RadioGroup,
  } from "@mui/material";
  import {
    Lock,
    Phone,
    BusinessCenter,
    Email,
    Grid3x3,
    AssignmentInd,
    Badge,
    Cake,
  } from "@mui/icons-material";
  
  import FormInput from "./FormInput";
  import Buttonme from "../Buttonme/Buttonme";
  
  export default function SignUpGDVForm({ center, form, onChange, onSubmit }) {
    return (
      <>
        <Grid container sx={{ height: "90%" }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
                //height: { xs: "50%", md: "100%" },
               // height: "auto",
               height: {xs: "auto", md: "100%"},
                pr: "calc(var(--padding-item)/2)",
             //backgroundColor: "red",
            }}
          >
            <Stack
              sx={{
                backgroundColor: "#f5f8ff",
                //backgroundColor: "green",
                p: "var(--padding-item)",
                py: 0,
                borderRadius: "20px",
                height: "100%"
              }}
            >
              <FormInput
                label="ID*"
                type="text"
                onChange={onChange}
                name="id"
                value={form.id}
                readOnly
                icon=<Grid3x3 />
                color = "other"
              />
              <FormInput
                label="Họ và Tên*"
                type="text"
                onChange={onChange}
                name="name"
                value={form.name}
                icon=<Badge />
              />
              
              <RadioGroup
                aria-labelledby="gender-radio-buttons-group-label"
                name="sex"
                value={form.sex}
                onChange={onChange}
                row
              >
                <FormControlLabel
                  value="Nam"
                  control={<Radio />}
                  label="Nam"
                  style={{ color: "black" }}
                />
                <FormControlLabel
                  value="Nữ"
                  control={<Radio />}
                  label="Nữ"
                  style={{ color: "black" }}
                />
              </RadioGroup>
              <FormInput
                label="Ngày sinh*"
                type="date"
                onChange={onChange}
                name="dob"
                value={form.dob}
                icon=<Cake />
              />
              <FormInput
                label="Số điện thoại*"
                type="text"
                onChange={onChange}
                name="phone"
                value={form.phone}
                icon=<Phone />
              />
              </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
        //backgroundColor: "brown",
          pl: "calc(var(--padding-item)/2)",
          height: { xs: "50%", md: "100%" },
          //height: "auto",
          display: {xs: "none", md: "flex"},
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            width: "100%",
            backgroundColor: "#f5f8ff",
            // backgroundColor: "yellow",
            p: "var(--padding-item)",
            py: 0,
            borderRadius: "20px",
            height: "90%",
            mb: { xs: 0, md: "var(--padding-item)" },
          }}
        >
            <FormInput
                label="Username"
                type="text"
                readOnly
                name="username"
                value={form.username}
                icon=<AssignmentInd />
                color="other"
              />
              <FormInput
                label="Email"
                type="text"
                readOnly
                name="email"
                value={form.email}
                icon=<Email />
                color="other"
              />
                <FormInput
                label="Điểm giao dịch"
                type="text"
                readOnly
                name="center"
                value={form.center}
                icon=<BusinessCenter />
                color="other"
              />
              <FormInput
                label="Password"
                type="text"
                readOnly
                name="password"
                value={form.password}
                icon=<Lock />
                color="other"
              />
            </Stack>
            {/* <Buttonme content="Tạo mới" onClick={onSubmit} /> */}
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: "2%",
            //   mt: "-20%",
            //   backgroundColor: "orange",
            }}
          >
            <Buttonme content="Tạo mới" onClick={onSubmit} />
          </Grid>
        </Grid>
      </>
    );
  }
  