import PropTypes from 'prop-types';

import * as Yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import { Box, Card, Grid, Container, TextField, Typography, Button } from '@material-ui/core';

// components
import Iconify from '../../Iconify';
// paths
import { PATH_PAGE } from '../../../routes/paths';

const TextContainer = styled(TextField)(({ theme }) => ({
  borderRadius: '10px',
  minWidth: 100,
  // height: 40,
  '& .MuiOutlinedInput-input': {
    backgroundColor: '#0E0D14',
    borderRadius: '10px',
    padding: theme.spacing(1, 2),
    fontWeight: 500,
    fontSize: '15px'
  },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
}));

const LabelStyle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 0)
}));

// ----------------------------------------------------------------------

ContributorContactForm.propTypes = {
  onBackToMain: PropTypes.func
};

export default function ContributorContactForm({ onBackToMain }) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const NewContactSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email Address is required').email(),
    desiredRole: Yup.string().required('This field is required'),
    content: Yup.string().required('This field is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      contactType: 'Contributor',
      name: '',
      email: '',
      desiredRole: '',
      github: '',
      twitter: '',
      discord: '',
      content: ''
    },
    validationSchema: NewContactSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        console.log(values);
        await new Promise((resolve) => setTimeout(resolve, 500));
        axios.post(`${process.env.REACT_APP_GOOGLE_SHEET_URL}`, values).then((response) => {
          const { status } = response;
          if (status === 200) {
            resetForm();
            setSubmitting(false);
            enqueueSnackbar('Submitted Successfully', { variant: 'success' });
            navigate(PATH_PAGE.root);
          }
        });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Container maxWidth="md">
          <Card sx={{ p: 3, my: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LabelStyle variant="body1">Name/Company</LabelStyle>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextContainer
                  fullWidth
                  id="outlined-start-adornment"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LabelStyle variant="body1">Email Address</LabelStyle>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextContainer
                  fullWidth
                  id="outlined-start-adornment"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LabelStyle variant="body1">Desired Role</LabelStyle>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextContainer
                  fullWidth
                  id="outlined-start-adornment"
                  {...getFieldProps('desiredRole')}
                  error={Boolean(touched.desiredRole && errors.desiredRole)}
                  helperText={touched.desiredRole && errors.desiredRole}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LabelStyle variant="body1">Github</LabelStyle>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextContainer
                  fullWidth
                  id="outlined-start-adornment"
                  placeholder="optional"
                  {...getFieldProps('github')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LabelStyle variant="body1">Twitter</LabelStyle>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextContainer
                  fullWidth
                  id="outlined-start-adornment"
                  placeholder="optional"
                  {...getFieldProps('twitter')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LabelStyle variant="body1">Discord</LabelStyle>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextContainer
                  fullWidth
                  id="outlined-start-adornment"
                  placeholder="optional"
                  {...getFieldProps('discord')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LabelStyle variant="body1">Do you have any questions for us?</LabelStyle>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextContainer
                  fullWidth
                  id="outlined-start-adornment"
                  multiline
                  maxRows={4}
                  {...getFieldProps('content')}
                  error={Boolean(touched.content && errors.content)}
                  helperText={touched.content && errors.content}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      padding: '4px 0 5px',
                      '& .MuiOutlinedInput-input': {
                        minHeight: 100,
                        maxHeight: 100
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Iconify icon="akar-icons:arrow-back-thick" sx={{ width: 20, height: 20 }} />}
                onClick={onBackToMain}
              >
                Back
              </Button>
              <LoadingButton
                type="submit"
                size="large"
                variant="contained"
                loading={isSubmitting}
                sx={{
                  boxShadow: 'none',
                  backgroundColor: '#5600C3',
                  '&:hover': {
                    backgroundColor: '#420391d6'
                  }
                }}
              >
                Submit
              </LoadingButton>
            </Box>
          </Card>
        </Container>
      </Form>
    </FormikProvider>
  );
}
